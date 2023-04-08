import PromptForCode from "../classes/PromptForCode";

import * as fs from "fs";
import * as path from "path";
import Api from "../classes/Api";
import Intelligence from "../classes/Intelligence";

export default class GenerateMigration extends PromptForCode {
	static prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;
	static ask = `{{CODE-OR-FILE}}`;
	static description = `Gera uma migration do Sequelize a partir das instruções que passamos, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;

	static async beforeSendCall(api: Api, codeOrFile: string, saveToFile ?: string): Promise<void> {
		console.log(`Disparando beforeSendCall...`);

		let file = path.resolve(process.env.PWD as string);

		if(codeOrFile.substr(0,1) != '/'){
			console.log(
				'path.resolve(process.env.PWD as string, codeOrFile)', 
				path.resolve(process.env.PWD as string, codeOrFile)
			);

			codeOrFile = path.resolve(process.env.PWD as string, codeOrFile);
		}

		if(fs.existsSync(codeOrFile)){
			file = codeOrFile;
		}

		if(saveToFile){
			if(saveToFile.substr(0,1) != '/'){
				console.log(
					'path.resolve(process.env.PWD as string, saveToFile)', 
					path.resolve(process.env.PWD as string, saveToFile)
				);

				saveToFile = path.resolve(process.env.PWD as string, saveToFile);
			}

			if(fs.existsSync(saveToFile)){
				file = saveToFile;
			}
		}

		if(!file){
			console.log(`Nenhum arquivo encontrado para disparar beforeSendCall`);
			return;
		}

		api.addContext(await Intelligence.getTsConfig(file))
		api.addContext(await Intelligence.getListOfFiles(file))
	}

	static async run(codeOrFile: string, saveToFile ?: string){
		if(saveToFile && saveToFile.substr(0, 1) != '/'){
			const arr = saveToFile.split('/');
			let filename = arr.pop();

			const moment = require("moment");
			filename = `${moment().format(`YYYYMMDDHHmmss`)}-${filename}`

			arr.push(filename);
			saveToFile = arr.join('/');
		}

		super.run(codeOrFile, saveToFile);
	}
}
