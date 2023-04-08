import * as fs from "fs";
import UpdateInterfaceFromModel from "./UpdateInterfaceFromModel";
import PromptForCode from "../classes/PromptForCode";
import DefaultBaseModel from "../defaults/Default.BaseModel";
import GenerateMigration from "./GenerateMigration";

const inquirer = require('inquirer');
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
                
            console.log('✅', 'Arquivo salvo em:', dir);
        }
    }

    protected static async updateInterface(modelPath: string, verbose = false){
        const modelDir = fs.existsSync(modelPath) 
				? modelPath 
				: path.resolve(process.env.PWD, modelPath);

        const array = modelDir.split('/');
        const modelName = array.pop();

        const interfaceDir = modelDir.replace('/' + modelName, '/../interfaces/models/' + modelName.replace('.ts', '.interface.ts'));

        if(fs.existsSync(interfaceDir)){
            const api = await UpdateInterfaceFromModel.send(
                fs.readFileSync(modelDir).toString(), 
                interfaceDir, 
                true
            );

            if(api){
                fs.copyFileSync(interfaceDir, interfaceDir + '.bk');
                fs.writeFileSync(interfaceDir, api.code[0]);

                EditModel.files.push(interfaceDir);
                EditModel.backups.push(interfaceDir + '.bk');

                console.log('✅', 'Arquivo salvo em:', interfaceDir);
            }
        }
    }

    protected static async createMigration(toDo: string, modelPath: string, verbose = false){
        const modelDir = fs.existsSync(modelPath) 
        ? modelPath 
        : path.resolve(process.env.PWD, modelPath);

        const array = modelDir.split('/');
        const modelName = array.pop().replace('.ts', '');

        let i = 0;
        let databaseFolder = null;

        while(!databaseFolder && i < 100){
            const files = fs.readdirSync(array.join('/'));

            if(files.indexOf('database') > -1){
                databaseFolder = array.join('/') + '/database';
                break;
            }

            array.pop();
            i++;
        }

        if(!databaseFolder || !fs.existsSync(databaseFolder)){
            console.error(`❌ Pasta das migrations não encontrada`, databaseFolder);
        }

        const moment = require("moment");
        const migrationDir = databaseFolder + `/${moment().format(`YYYYMMDDHHmmss`)}-adjusts-to-${modelName}.js`;
        
        const api = await GenerateMigration.send(
            `Crie uma migration que faça o seguinte com a tabela ${modelName}: ${toDo}`, 
            migrationDir, 
            true
        );

        if(api){
            fs.writeFileSync(migrationDir, api.code[0]);
            EditModel.files.push(migrationDir);
			console.log('✅', 'Arquivo salvo em:', migrationDir);
        }
    }

	static async run(toDo: string, saveToFile: string, verbose = false){
		const self = this;

        EditModel.files = [];
        console.log('Editando model...');
        await EditModel.editModel(toDo, saveToFile, verbose);

        console.log('Editando interface...');
        await EditModel.updateInterface(saveToFile, verbose);

        console.log('Gerando migration...');
        await EditModel.createMigration(toDo, saveToFile, verbose);

        const answer = await inquirer.prompt([
            {
                type: "confirm",
                name: "continue",
                message: "Deseja salvar as alterações?",
                default: true,
            },
        ]);

        if (!answer.continue) {
            for(const file of self.files){
                fs.rmSync(file);
            }

            for(const file of self.backups){
                fs.copyFileSync(file, file.replace('.bk', ''));
                fs.rmSync(file);
            }

            console.log("🙅‍♂️ Alterações revertidas");
            process.exit(1);
        }
        
        for(const file of self.backups){
            fs.copyFileSync(file, file.replace('.bk', ''));
        }
        return true;
    }
}