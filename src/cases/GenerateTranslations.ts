import PromptForCode from "../classes/PromptForCode";

import Api from "../classes/Api";
import DefaultMigration from "../defaults/Default.Migration";
import DefaultBaseModel from "../defaults/Default.BaseModel";

import * as fs from "fs";
const path = require('path');

const inquirer = require('inquirer');
const colors = require('colors');

export default class GenerateMigration extends PromptForCode {
	public static prompt = ``;

	public static ask = `Com base nesse array:

\`\`\`
{{CODE-OR-FILE}}
\`\`\`

Preencha:

\`\`\`
	
	// Essa variável define a tradução do nome de cada coluna do model.
	static columnNameTranslation: { [name: string]: string } = {
		'id': 'id',
		'createdAt': 'Data de Registro',
		'updatedAt': 'Última Edição Em',
	};
	
	// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.
	static sensitiveColumns: string[] = ['password', 'provisoryPassword', 'passwordToken', 'lastCreatedToken'];
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

	static async send(codeOrFile: string, saveToFile ?: string, verbose = false){
        saveToFile = codeOrFile;

		if(fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			codeOrFile = path.resolve(process.cwd(), codeOrFile);
		}

		const code = fs.readFileSync(codeOrFile).toString();

		console.log('codeOrFile', codeOrFile);
		
		const api = await super.send(
			JSON.stringify(this.extractColumnNames(code)), 
			saveToFile, 
			verbose
		);

		if(!api){
			throw new Error(`Nenhum código encontrado`);
		}

		const newCode = this.apply(codeOrFile, code, api.code[0])
		this.save(path, code, newCode);
		return newCode;

	}

	static async run(codeOrFile: string, saveToFile ?: string, verbose = false){
        saveToFile = codeOrFile;

		if(fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			codeOrFile = path.resolve(process.cwd(), codeOrFile);
		}

		const code = fs.readFileSync(codeOrFile).toString();
		const newCode = await this.send(codeOrFile, saveToFile, verbose);

		this.save(path, code, newCode);
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

		const arr = newCode.split('// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.');
		const columnNameTranslation = arr[0];
		const sensitiveColumns = `// Essa variável define colunas que tem dados sensíveis e não devem ser exibidos.\n` + arr[1];

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
			const end = findIndexOfNext(code, `sensitiveColumns`, `};`);
			code = code.substring(0, start) + code.substring(end + 2);
		}

		if(code.indexOf(`sensitiveColumns`) == -1){
			const indexOf = findIndexOfNext(code, `class`, `{`);
			code = code.substring(0, indexOf + 1) +  "\n" + sensitiveColumns + code.substring(indexOf + 1);
		}

		return code;
	}

	static async save(path: string, code: string, newCode: string){

		fs.writeFileSync(path + '.bk', code);
		fs.writeFileSync(path, newCode);

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
