import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultInterface from "../defaults/Default.Interface";

export default class GenerateInterface extends PromptForCode {
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

E essa é a interface desse model:

\`\`\`
${DefaultInterface}
\`\`\``;
	
	static ask = `Com base no exemplo acima, gera apenas a interface do seguinte model:`;
	static description = `Gera uma interface a partir do código que passamos.`;
}
