import PromptForCode from "../classes/PromptForCode";

import Api from "../classes/Api";
import DefaultMigration from "../defaults/Default.Migration";
import DefaultBaseModel from "../defaults/Default.BaseModel";

import * as fs from "fs";
const path = require('path');

const inquirer = require('inquirer');
const colors = require('colors');
const { exec } = require('child_process');

function executeShell(shell: string) {
  return new Promise((resolve, reject) => {
    exec(shell, (error: any, stdout: string, stderr: string) => {
      if (error) {
        reject(`Erro ao executar o script: ${error}`);
        return;
      }
      resolve(`Saída do script: ${stdout}`);
    });
  });
}

export default class GenerateTranslations extends PromptForCode {
	public static prompt = ``;

	public static ask = `{{CODE-OR-FILE}}

Preencha:

\`\`\`
	// Essa variável define a tradução do nome do model para português do Brasil.
	static modelNameTranslation = '<PREENCHA>';
	
	// Essa variável define a tradução do nome de cada coluna do model para português do Brasil.
	static columnNameTranslation: { [name: string]: string } = {
		'id': 'ID',
		'createdAt': 'Data de Registro',
		'updatedAt': 'Última Edição Em',
		<COMPLETE>
	};
	
	// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.
	static sensitiveColumns: string[] = ['password', 'provisoryPassword', 'passwordToken', 'lastCreatedToken', <COMPLETE>];
\`\`\` 
`;
	public static description = `Gera uma columnNameTranslation e sensitiveColumns de um model`;

    static extractColumnNames(code: string) {
        // const regex = /@Column(?:\([^)]*\))?\s+(?:\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s+)?([^:]+)(?=:)/g;
        // const regex = /@Column(?:\([^)]*\))?\s+(?:\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s+)?(?:@[a-zA-Z_]\w*\(\)\s+)?([^:]+)(?=:)/g;
        const regex = /@Column(?:\([^)]*\))?\s+(?:\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s+)*(?:@[a-zA-Z_]\w*\(\)\s+)*(?:\/\*[^*]*\*+([^/*][^*]*\*+)*\/\s+)*([^:]+)(?=:)/g;
        
        const columnNames = [];
      
        let match;
        while ((match = regex.exec(code)) !== null) {
          columnNames.push(match[3].replace(/[\W_]+/g," ").trim());
        }
      
        return columnNames;
      }

	static async process(codeOrFile: string, saveToFile ?: string, verbose = false){
        saveToFile = codeOrFile;

		if(fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			codeOrFile = path.resolve(process.cwd(), codeOrFile);
		}

		const nameArr = codeOrFile.split('/');

		const code = fs.readFileSync(codeOrFile).toString();

		console.log('codeOrFile', codeOrFile);

		const prompt = `Com base nesse array:

		\`\`\`
		${JSON.stringify(this.extractColumnNames(code))}
		\`\`\`
		
		E no nome do modelo em inglês: ${nameArr.pop()}

		`
		
		const api = await super.send(
			prompt, 
			saveToFile, 
			verbose
		);

		if(!api){
			throw new Error(`Nenhum código encontrado`);
		}

		const newCode = this.apply(codeOrFile, code, api.code[0])
		return newCode;

	}

	static async run(codeOrFile: string, saveToFile ?: string, verbose = false){
        saveToFile = codeOrFile;

		if(fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			codeOrFile = path.resolve(process.cwd(), codeOrFile);
		}

		const code = fs.readFileSync(codeOrFile).toString();
		const newCode = await this.process(codeOrFile, saveToFile, verbose);

		this.save(codeOrFile, code, newCode);
		return newCode;
	}

	static apply(path: string, code: string, newCode: string){
		function findIndexOfNext(str: string, word: string, charSequence: string) {
			const wordIndex = str.indexOf(word);
			const charIndex = str.indexOf(charSequence, wordIndex);
			return charIndex;
		}

		function findIndexOfLast(str: string, word: string, charSequence: string) {
			const wordIndex = str.lastIndexOf(word);
			const charIndex = str.lastIndexOf(charSequence, wordIndex);
			return charIndex;
		}

		const originalCode = code;

		const arrName = newCode.split('// Essa variável define a tradução do nome de cada coluna do model para português do Brasil.');
		const modelNameTranslation = arrName[0];
		

		const arr = newCode
			.substring(newCode.indexOf('// Essa variável define a tradução do nome de cada coluna do model para português do Brasil.'))
			.split('// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.');
			
		const columnNameTranslation = arr[0];
		const sensitiveColumns = `// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.` + arr[1];

		if(code.indexOf(`columnNameTranslation`) > -1){
			const start = code.indexOf(`static columnNameTranslation`);
			const end = findIndexOfNext(code, `columnNameTranslation`, `};`);
			code = code.substring(0, start) + code.substring(end + 2);
		}

		if(code.indexOf(`columnNameTranslation`) == -1){
			const indexOf = findIndexOfNext(code, `class`, `{`);
			code = code.substring(0, indexOf + 1) + "\n" +  columnNameTranslation + code.substring(indexOf + 1);
		}

		if(code.indexOf(`sensitiveColumns`) > -1){
			const start = code.indexOf(`static sensitiveColumns`);
			const end = findIndexOfNext(code, `sensitiveColumns`, `];`);
			code = code.substring(0, start) + code.substring(end + 2);
		}

		if(code.indexOf(`sensitiveColumns`) == -1){
			const indexOf = findIndexOfNext(code, `class`, `{`);
			code = code.substring(0, indexOf + 1) +  "\n" + sensitiveColumns + code.substring(indexOf + 1);
		}

		if(code.indexOf(`modelNameTranslation`) > -1){
			const start = code.indexOf(`static modelNameTranslation`);
			const end = findIndexOfNext(code, `modelNameTranslation`, `;`);
			code = code.substring(0, start) + code.substring(end + 2);
		}

		if(code.indexOf(`modelNameTranslation`) == -1){
			const indexOf = findIndexOfNext(code, `class`, `{`);
			code = code.substring(0, indexOf + 1) +  "\n" + modelNameTranslation + code.substring(indexOf + 1);
		}

		return code;
	}

	static async save(path: string, code: string, newCode: string){
		fs.writeFileSync(path + '.bk', code);
		fs.writeFileSync(path, newCode);

		console.log(await executeShell(`npx prettier --write "${path}"  --tab-width 4 --use-tabs --html-whitespace-sensitivity=css || true`));

		console.log('✅ Arquivo salvo em:', path);

		const answer = await inquirer.prompt([
			{
				type: "confirm",
				name: "continue",
				message: "Deseja salvar?",
				default: true,
			},
		]);

		if (!answer.continue) {
			fs.copyFileSync(path + '.bk', path as string);
			fs.rmSync(path + '.bk');

			console.log("🙅‍♂️ Alterações revertidas");
			process.exit(1);
		}
		
		fs.rmSync(path + '.bk');
	}
}
