import Api from "./Api";
import * as fs from "fs";
import DurinnGPT from "./DurinnGPT";

const inquirer = require('inquirer');
const colors = require('colors');
const path = require('path');

export default class PromptForCode {
	protected static prompt = '';
	protected static ask = '';
	
	// Describe this what this class does
	protected static description = 'Descrição não fornecida';

	static getCodeOrFile(codeOrFile: string){
		const self = this;
		const path = require('path');

		let code = codeOrFile;

		if(fs.existsSync(codeOrFile) || fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			const dir = fs.existsSync(codeOrFile) 
				? codeOrFile 
				: path.resolve(process.cwd(), codeOrFile);
			code = fs.readFileSync(dir).toString();
		}

		return code;
	}

	static async beforeSendCall(api: Api, codeOrFile: string, saveToFile ?: string){
		// It's a hook
	}

	static async send(codeOrFile: string, saveToFile ?: string, verbose = false){
		const self = this;

		if(fs.existsSync(path.resolve(process.cwd(), codeOrFile))){
			codeOrFile = path.resolve(process.cwd(), codeOrFile);
		}

		if(saveToFile && fs.existsSync(path.resolve(process.cwd(), saveToFile))){
			saveToFile = path.resolve(process.cwd(), saveToFile);
		}

		let code = PromptForCode.getCodeOrFile(codeOrFile);
		let saveToFileCode = saveToFile ? PromptForCode.getCodeOrFile(saveToFile) : '';

		if(!code){
			console.log(`${self.name}: ${self.description}`);
			console.log(`Usage: npm run durinn-gpt -- ${DurinnGPT.pascalToKebabCase(self.name)} <CODE> <FILE-TO-SAVE>`);
			return false;
		}

		const prompt = self.prompt.replace('{{CODE-OR-FILE}}', code).replace('{{SAVE-TO-FILE}}', saveToFileCode);
		const ask = `${self.ask}`.replace('{{CODE-OR-FILE}}', code).replace('{{SAVE-TO-FILE}}', saveToFileCode);
		
		const api = new Api();
		await this.beforeSendCall(api, codeOrFile, saveToFile);

		if(verbose){
			console.log('Contexto:', api.context);
			console.log('Prompt:', (prompt as any).green);
			console.log('Ask:', (ask as any).green);
		}

		if(!prompt && !ask){
			throw new Error('❌ Nenhum prompt ou ask informados');
		}

		const call = await api.send([
			{role: 'system', content: prompt},
			{role: 'user', content: ask}
		]);

		if(verbose && call.code && call.code.length){
			console.log((call.code[0] as any).red);
		}

		return call;
	}
	
	static async run(codeOrFile: string, saveToFile ?: string, verbose = false): Promise<any>{
		const self = this;
		
		const api = await self.send(codeOrFile, saveToFile, verbose);

		if(!api){
			return false;
		}

		if(!api.code[0]){
			return console.error('❌ Nenhum código retornado', api);
		}
		
		if(saveToFile){
			if(saveToFile.substr(0,1) != '/'){
				saveToFile = path.resolve(process.cwd(), saveToFile);
			}
			
			let creating_from_scratch = true;

			if(fs.existsSync(saveToFile as string)){
				fs.copyFileSync(saveToFile as string, saveToFile + '.bk');
				creating_from_scratch = false;
			}

			fs.writeFileSync(saveToFile as string, api.code[0]);

			console.log('✅ Arquivo salvo em:', saveToFile);

			const answer = await inquirer.prompt([
				{
					type: "confirm",
					name: "continue",
					message: "Deseja salvar?",
					default: true,
				},
			]);

			if (!answer.continue) {
				if(creating_from_scratch){
					fs.rmSync(saveToFile as string);
				}else{
					fs.copyFileSync(saveToFile + '.bk', saveToFile as string);
					fs.rmSync(saveToFile + '.bk');
				}

				console.log("🙅‍♂️ Alterações revertidas");
				process.exit(1);
			}
			
			fs.rmSync(saveToFile + '.bk');
			return api;
		}
		
		DurinnGPT.copyToClipboard(api.code[0]);
		console.log('✅ Código copiado para a área de transferência');
		
		return api;
	}
}
