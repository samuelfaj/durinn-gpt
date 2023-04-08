import * as fs from "fs";
import UpdateInterfaceFromModel from "./UpdateInterfaceFromModel";
import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";

const path = require('path');

export default class EditModel extends PromptForCode {
    static files: string[] = [];
    static backups: string[] = [];

	static description = `Edita um model, atualiza a interface e cria uma migration.`;

    protected static async editModel(codeOrFile: string, saveToFile: string, verbose = false){
        EditModel.prompt = `Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${DefaultBaseModel}
\`\`\`

Esse é o model do nosso sistema:

\`\`\`
{{SAVE-TO-FILE}}
\`\`\``;
            
        EditModel.ask = `Com base no model acima, faça as atualizações requisitadas abaixo. Você deve responder em markdown apenas o código e entre (\`\`\`). Sem explicações.\n Faça o seguinte: "{{CODE-OR-FILE}}"`;

        const dir = fs.existsSync(saveToFile) 
				? saveToFile 
				: path.resolve(process.env.PWD, saveToFile);

        const api = await EditModel.send(codeOrFile, saveToFile, verbose);

        if(api){
            fs.copyFileSync(dir, dir + '.bk');
            fs.writeFileSync(dir, api.code[0]);

            EditModel.files.push(dir);
            EditModel.backups.push(dir + '.bk');
        }
    }

    protected static async updateInterface(modelPath: string, verbose = false){
        console.log('updateInterface', modelPath, verbose);

        const modelDir = fs.existsSync(modelPath) 
				? modelPath 
				: path.resolve(process.env.PWD, modelPath);

        const array = modelDir.split('/');
        const modelName = array.pop();

        const interfaceDir = modelDir.replace('/' + modelName, '/../interfaces/models/' + modelName.replace('.ts', '.interface.ts'));

        if(fs.existsSync(interfaceDir)){
            console.log('fs.readFileSync(interfaceDir).toString()', fs.readFileSync(interfaceDir).toString());

            const api = await UpdateInterfaceFromModel.send(
                fs.readFileSync(interfaceDir).toString(), 
                interfaceDir, 
                true
            );

            if(api){
                fs.copyFileSync(interfaceDir, interfaceDir + '.bk');
                fs.writeFileSync(interfaceDir, api.code[0]);

                EditModel.files.push(interfaceDir);
                EditModel.backups.push(interfaceDir + '.bk');
            }
        }
    }

	static async run(codeOrFile: string, saveToFile: string, verbose = false){
		const self = this;

        EditModel.files = [];
        console.log('Editando model...');
        await EditModel.editModel(codeOrFile, saveToFile, verbose);

        console.log('Editando interface...');
        await EditModel.updateInterface(saveToFile, verbose);
    }
}