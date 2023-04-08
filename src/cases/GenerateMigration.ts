import PromptForCode from "../classes/PromptForCode";

export default class GenerateMigration extends PromptForCode {
	static prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;
	static ask = `{{CODE-OR-FILE}}`;
	static description = `Gera uma migration do Sequelize a partir das instruções que passamos, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;

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
