import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";

export default class UpdateModelFromMigration extends PromptForCode {
	static description = `Atualiza um model com base em uma migration que passamos.`;
	static prompt = 
		`Vou fornecer alguns exemplos para que você grave o contexto:\n\n`+ 
		`Esse é um exemplo de classe padrão do nosso sistema:\n\n`+ 
		`\`\`\`\n`+ 
		`${DefaultBaseModel}\n`+ 
		`\`\`\`\n\n` + 
		`Esse é o model do nosso sistema:\n\n` + 
		`\`\`\`\n` + 
		`{{SAVE-TO-FILE}}\n` + 
		`\`\`\``;
	static ask = `Com base no modelo acima, aplique no model as alterações propostas na migration abaixo, você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n\`\`\`\n{{CODE-OR-FILE}}\`\`\``;
}
