import DurinnGPT from "../classes/DurinnGPT";
import Api from "../classes/Api";
import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultInterface from "../defaults/Default.Interface";

import * as fs from "fs";
import * as path from "path";
import Intelligence from "../classes/Intelligence";

export default class UpdateInterfaceFromModel extends PromptForCode {
	static description = `Atualiza uma interface com base em um model que passamos.`;
	static prompt = 
		`Vou fornecer alguns exemplos para que você grave o contexto:\n\n`+ 
		`Esse é um exemplo de classe padrão do nosso sistema:\n\n`+ 
		`\`\`\`\n`+ 
		`${DefaultBaseModel}\n`+ 
		`\`\`\`\n\n` + 
		`Esse é um exemplo de interface padrão do nosso sistema:\n\n`+ 
		`\`\`\`\n`+ 
		`${DefaultInterface}\n`+ 
		`\`\`\`\n\n` + 
		`Esse é o model a ser analisado:\n\n` + 
		`\`\`\`\n` + 
		`{{CODE-OR-FILE}}\n` + 
		`\`\`\``;
	static ask = `Com base no model acima, atualize a interface abaixo para que contenha todas as colunas e relações do model, você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n\`\`\`\n{{SAVE-TO-FILE}}\`\`\``;

	static async beforeSendCall(api: Api, codeOrFile: string, saveToFile ?: string): Promise<void> {
		let file = '';

		if(codeOrFile.substr(0,1) != '/'){
			codeOrFile = path.resolve(process.cwd() as string, codeOrFile);
		}

		if(fs.existsSync(codeOrFile)){
			file = codeOrFile;
		}

		if(saveToFile){
			if(saveToFile.substr(0,1) != '/'){
				saveToFile = path.resolve(process.cwd() as string, saveToFile);
			}

			if(fs.existsSync(saveToFile)){
				file = saveToFile;
			}
		}

		if(!file){
			return;
		}

		api.addContext(await Intelligence.getTsConfig(file))
		api.addContext(await Intelligence.getListOfFiles(file))
	}
}
