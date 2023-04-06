import Api from "./Api";
import * as fs from "fs";
import DurinnGPT from "./DurinnGPT";


export default class PromptForCode {
	protected static prompt = '';
	protected static ask = '';
	
	// Describe this what this class does
	protected static description = 'Descrição não fornecida';
	
	static async run(code: string, saveToFile ?: string){
		const self = this;
		
		if(!code){
			console.log(`${self.name}: ${self.description}`);
			console.log(`Usage: npm run durinn-gpt -- ${DurinnGPT.pascalToKebabCase(self.name)} <CODE> <FILE-TO-SAVE>`);
			return;
		}
		
		const api = await Api.send([
			{role: 'system', content: this.prompt},
			{role: 'user', content: `${this.ask}\n\`\`\`\n${code}\`\`\``}
		]);
		
		if(!api.code[0]){
			return console.error(`Nenhum código retornado`, api);
		}
		
		if(saveToFile){
			fs.writeFileSync(saveToFile, api.code[0]);
		}
		
		DurinnGPT.copyToClipboard(api.code[0]);
		console.log('Código copiado para a área de transferência');
		
		return api;
	}
}
