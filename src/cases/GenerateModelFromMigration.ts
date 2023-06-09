import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultMigration from "../defaults/Default.Migration";

export default class GenerateModelFromMigration extends PromptForCode {
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
	
	static ask = `Usando como base o model acima, gere um model à partir deste código:\n\`\`\`\n{{CODE-OR-FILE}}\`\`\`\n Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações.`;
	static description = `Gera um model a partir do código de uma migration que passamos.`;
}
