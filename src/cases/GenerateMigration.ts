import PromptForCode from "../classes/PromptForCode";

export default class GenerateMigration extends PromptForCode {
	static prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;
	static ask = ``;
	static description = `Gera uma migration do Sequelize a partir das instruções que passamos. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;

	static async run(codeOrFile: string, saveToFile ?: string){
		if(saveToFile){
			const moment = require("moment");
			saveToFile = `${moment().format(`YYYYMMDDHHmmss`)}-${saveToFile}`
		}

		super.run(codeOrFile, saveToFile);
	}
}
