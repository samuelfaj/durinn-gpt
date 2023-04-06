import PromptForCode from "@durinnGPT/classes/PromptForCode";
import DefaultBaseModel from "@durinnGPT/defaults/Default.BaseModel";
import DefaultModel from "@durinnGPT/defaults/Default.Model";
import DefaultMigration from "@durinnGPT/defaults/Default.Migration";

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
	
	static ask = `Com base no modelo acima, gere uma sequelize ORM migration à partir deste model:`;
	static description = `Gera uma migration a partir do código de um model que passamos.`;
}
