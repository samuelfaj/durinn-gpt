import * as fs from "fs";
import * as path from "path";

import Api from "../classes/Api";
import DurinnGPT from "../classes/DurinnGPT";
import VoiceToText from "../classes/VoiceToText";

export default class VoiceToTrello {
    static async run(codeOrFile: string, verbose: boolean = false) {
        const self = this;

        const fileDir = fs.existsSync(path.resolve(process.cwd(), codeOrFile)) 
        ? path.resolve(process.cwd(), codeOrFile)  
        : codeOrFile;

		const text = await VoiceToText.send(fileDir, verbose);

		const api = new Api();

		const call = await api.send([
			// {role: 'system', content: prompt},
			{role: 'user', content: `Quero que você aja como o gerente de projetos de um time de desenvolvimento de sistemas. Entenda a requisição deste cliente e monte um card no trello para o roadmap de desenvolvimento de sistemas:

"${text}"

Sugira:
- Título do cartão: 
- Descrição do cartão 
- Checklist
- Prioridade`}
		]);


		if(!call.text){
			return console.error('❌ Nenhum texto retornado');
		}

        console.log("-----------------------------------------\n\n");
        console.log(call.text);
        console.log("\n\n-----------------------------------------\n");


		DurinnGPT.copyToClipboard(call.text);
		console.log('✅ Código copiado para a área de transferência');

		return call;
    }
}
