import * as fs from "fs";
import UpdateInterfaceFromModel from "./UpdateInterfaceFromModel";
import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultMigration from "../defaults/Default.Migration";


const path = require('path');

export default class EditModel extends PromptForCode {
    static files: string[] = [];
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
            
        EditModel.ask = `Com base no model acima, faça o seguinte: "{{CODE-OR-FILE}}".\n` + 
        `Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações.`;

        const dir = fs.existsSync(saveToFile) 
				? saveToFile 
				: path.resolve(process.env.PWD, saveToFile);

        EditModel.files.push(dir);
        return await EditModel.send(codeOrFile, saveToFile, verbose);
    }

    protected static async updateInterface(modelPath: string, verbose = false){
        const modelDir = fs.existsSync(modelPath) 
				? modelPath 
				: path.resolve(process.env.PWD, modelPath);

        const array = modelDir.split('/');
        const modelName = array.pop();

        const interfaceDir = modelDir.replace('/' + modelName, '/../interfaces/models/' + modelName.replace('.ts', '.interface.ts'));

        if(fs.existsSync(interfaceDir)){
            EditModel.files.push(interfaceDir);
            await UpdateInterfaceFromModel.run(modelDir, interfaceDir, verbose);
        }
    }

	static async run(codeOrFile: string, saveToFile: string, verbose = false){
		const self = this;

        EditModel.files = [];
        await EditModel.editModel(codeOrFile, saveToFile, verbose);
        await EditModel.updateInterface(saveToFile, verbose);
    }
}