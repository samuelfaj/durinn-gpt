import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultMigration from "../defaults/Default.Migration";

export default class GenerateMigrationFromModel extends PromptForCode {
	static prompt = `
Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${DefaultBaseModel}
\`\`\`

Esse é um exemplo de model do nosso sistema:

\`\`\`
${DefaultModel}
\`\`\`

E essa é a migration que gerou esse model:

\`\`\`
${DefaultMigration}
\`\`\``;
	
	static ask = `Com base no modelo acima, gere uma sequelize ORM migration à partir deste model, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código: \n\`\`\`\n{{CODE-OR-FILE}}\`\`\``;
	static description = `Gera uma migration a partir do código de um model que passamos.`;

	static async run(codeOrFile: string, saveToFile ?: string){
		if(saveToFile){
			const moment = require("moment");
			saveToFile = `${moment().format(`YYYYMMDDHHmmss`)}-${saveToFile}`
		}

		super.run(codeOrFile, saveToFile);
	}
}
