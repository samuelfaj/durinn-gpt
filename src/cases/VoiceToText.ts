import Api from "../classes/Api";
import * as fs from "fs";
import DurinnGPT from "../classes/DurinnGPT";
import {default as _VoiceToText} from "../classes/VoiceToText";

const inquirer = require('inquirer');
const colors = require('colors');
const path = require('path');

export default class VoiceToText {
	static async run(codeOrFile: string): Promise<any>{
		const self = this;
		
        const fileDir = fs.existsSync(path.resolve(process.cwd(), codeOrFile)) 
        ? path.resolve(process.cwd(), codeOrFile)  
        : codeOrFile;

		const text = await _VoiceToText.send(fileDir);

		if(!text){
			return console.error('❌ Nenhum texto retornado');
		}

        console.log("-----------------------------------------\n\n");
        console.log(text);
        console.log("\n\n-----------------------------------------\n");
		
		DurinnGPT.copyToClipboard(text);
		console.log('✅ Código copiado para a área de transferência');
		
		return text;
	}
}
