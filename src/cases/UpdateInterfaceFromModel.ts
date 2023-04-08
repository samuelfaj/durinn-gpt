import DurinnGPT from "../classes/DurinnGPT";
import Api from "../classes/Api";
import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultInterface from "../defaults/Default.Interface";

export default class UpdateInterfaceFromModel extends PromptForCode {
	static description = `Atualiza uma interface com base em um model que passamos.`;
	static prompt = 
		`Vou fornecer alguns exemplos para que você grave o contexto:\n\n`+ 
		// `Esse é um exemplo de classe padrão do nosso sistema:\n\n`+ 
		// `\`\`\`\n`+ 
		// `${DefaultBaseModel}\n`+ 
		// `\`\`\`\n\n` + 
		`Esse é um exemplo de interface padrão do nosso sistema:\n\n`+ 
		`\`\`\`\n`+ 
		`${DefaultInterface}\n`+ 
		`\`\`\`\n\n` + 
		`Esse é o model a ser analisado:\n\n` + 
		`\`\`\`\n` + 
		`{{CODE-OR-FILE}}\n` + 
		`\`\`\``;

	static ask = `As interfaces do sistema são arquivos que nos dão uma definição dos campos existentes no model e nós compartilhamos esses arquivos com o frontend.\n` + 
	`Atualize a interface abaixo, adicionando os campos que existem no model mas não existem nele ou removendo os que existem nele mas não existem no model.\n` + 
	`Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n`+ 
	`\`\`\`\n{{SAVE-TO-FILE}}\n\`\`\``;
}
