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
	
	static ask = `Com base no exemplo acima, gere apenas a interface do seguinte model. Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código:\n\`\`\`\n{{CODE-OR-FILE}}\`\`\``;
	static description = `Ger uma interface a partir do código que passamos.`;
}
