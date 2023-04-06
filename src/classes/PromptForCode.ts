import Api from "./Api";
import * as fs from "fs";
import DurinnGPT from "./DurinnGPT";


export default class PromptForCode {
	protected static prompt = '';
	protected static ask = '';
	
	// Describe this what this class does
	protected static description = 'Descrição não fornecida';

	static getCodeOrFile(codeOrFile: string){
		const self = this;
		const path = require('path');

		let code = codeOrFile;

		if(fs.existsSync(codeOrFile) || fs.existsSync(path.resolve(process.env.PWD, codeOrFile))){
			const dir = fs.existsSync(codeOrFile) 
				? codeOrFile 
				: path.resolve(process.env.PWD, codeOrFile);
			code = fs.readFileSync(dir).toString();
		}

		return code;
	}
	
	static async run(codeOrFile: string, saveToFile ?: string){
		const self = this;
		const path = require('path');

		let code = PromptForCode.getCodeOrFile(codeOrFile);
		let saveToFileCode = saveToFile ? PromptForCode.getCodeOrFile(saveToFile) : '';

		if(!code){
			console.log(`${self.name}: ${self.description}`);
			console.log(`Usage: npm run durinn-gpt -- ${DurinnGPT.pascalToKebabCase(self.name)} <CODE> <FILE-TO-SAVE>`);
			return;
		}
		
		const api = await Api.send([
			{role: 'system', content: this.prompt.replace('{{CODE-OR-FILE}}', codeOrFile).replace('{{SAVE-TO-FILE}}', saveToFileCode)},
			{role: 'user', content: `${this.ask}\n\`\`\`\n${code}\`\`\``.replace('{{CODE-OR-FILE}}', codeOrFile).replace('{{SAVE-TO-FILE}}', saveToFileCode)}
		]);
		
		if(!api.code[0]){
			return console.error(`Nenhum código retornado`, api);
		}
		
		if(saveToFile){
			if(saveToFile.substr(0,1) != '/'){
				saveToFile = path.resolve(process.env.PWD, saveToFile);
			}

			fs.writeFileSync(saveToFile as string, api.code[0]);
			console.log('✅ Arquivo salvo em:', saveToFile);

			return api;
		}
		
		DurinnGPT.copyToClipboard(api.code[0]);
		console.log('✅ Código copiado para a área de transferência');
		
		return api;
	}
}
