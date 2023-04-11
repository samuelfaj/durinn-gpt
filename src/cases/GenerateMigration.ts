import PromptForCode from "../classes/PromptForCode";

import Api from "../classes/Api";
import DefaultMigration from "../defaults/Default.Migration";
import DefaultBaseModel from "../defaults/Default.BaseModel";

export default class GenerateMigration extends PromptForCode {

	static prompt = `
Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${DefaultBaseModel}
\`\`\`

Esse é um exemplo de migration do nosso sistema:

\`\`\`
${DefaultMigration}
\`\`\`

Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;

	static ask = `{{CODE-OR-FILE}}`;
	static description = `Gera uma migration do Sequelize a partir das instruções que passamos, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;

	static async beforeSendCall(api: Api, codeOrFile: string, saveToFile ?: string): Promise<void> {
		// api.addContext(await Intelligence.getTsConfig())
		// api.addContext(await Intelligence.getListOfFiles())
	}

	// static async run(codeOrFile: string, saveToFile ?: string, verbose = false){
	// 	if(saveToFile && saveToFile.substr(0, 1) != '/'){
	// 		const arr = saveToFile.split('/');
	// 		let filename = arr.pop();

	// 		const moment = require("moment");
	// 		filename = `${moment().format(`YYYYMMDDHHmmss`)}-${filename}`

	// 		arr.push(filename);
	// 		saveToFile = arr.join('/');
	// 	}

	// 	super.ask = this.ask;
	// 	super.description = this.description;
	// 	super.run(codeOrFile, saveToFile, verbose);
	// }
}
