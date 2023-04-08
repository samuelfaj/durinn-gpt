import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultInterface from "../defaults/Default.Interface";
import DefaultMigration from "../defaults/Default.Migration";

import {Messages} from "./Api";

const fs = require('fs');
const path = require('path');

export default class Intelligence {
	static async getDefaultContext(): Promise<Messages>{
        return [
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Esse é um exemplo de classe padrão do nosso sistema:\n` + 
					`\`\`\`${DefaultBaseModel}\`\`\``
			},
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Esse é um exemplo de model do nosso sistema:\n` + 
					`\`\`\`${DefaultModel}\`\`\``
			},
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Esse é um exemplo de model de interface do nosso sistema:\n` + 
					`\`\`\`${DefaultInterface}\`\`\``
			},
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Esse é um exemplo de model de migration do nosso sistema:\n` + 
					`\`\`\`${DefaultMigration}\`\`\``
			}
		];
	}

	static async getTsConfig(filePath: string): Promise<Messages>{
        const modelDir = fs.existsSync(path.resolve(process.cwd(), filePath)) 
        ? path.resolve(process.cwd(), filePath)
        : filePath;

        const array = modelDir.split('/');

        let i = 0;
        let rootFolder = null;

        while(!rootFolder && i < 100){
	        if(fs.existsSync(array.join('/')) && fs.lstatSync(array.join('/')).isDirectory() ){
				const files = fs.readdirSync(array.join('/'));
				
				if(files.indexOf('tsconfig.json') > -1){
					rootFolder = array.join('/');
					break;
				}
			}
			
            array.pop();
            i++;
        }

        if(!fs.existsSync(rootFolder)){
            throw new Error(`Pasta raiz não encontrada`);
        }

        return [
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Essa é o tsconfig.json do sistema:\n` + 
					`\`\`\`${fs.readFileSync(rootFolder + '/tsconfig.json').toString()}\`\`\``
			}
        ]
    }

	static async getListOfFiles(filePath: string): Promise<Messages> {
        const ignoredFolders = ['.git', '.build'];
        const recursivelyListFiles = (directory: string, ignoredFolders: string[] = []): string[] => {
            const files: string[] = [];
        
            // list all files in the current directory
            const currentFiles = fs.readdirSync(directory);
        
            // iterate over each found file
            currentFiles.forEach((file: string) => {
                // create the full path to the file
                const fullPath = path.join(directory, file);
            
                // check if the path is a directory and not in the ignored folders list
                if (fs.statSync(fullPath).isDirectory() && !ignoredFolders.includes(file)) {
                    // if it is a directory and not ignored, recursively list its files
                    files.push(...recursivelyListFiles(fullPath, ignoredFolders));
                } else {
                    // if it is a file or an ignored directory, add it to the list of files
                    files.push(fullPath);
                }
            });
        
            return files;
        }

        const modelDir = fs.existsSync(path.resolve(process.cwd(), filePath)) 
        ? path.resolve(process.cwd(), filePath) 
        : filePath;

        const array = modelDir.split('/');

        let i = 0;
        let rootFolder = null;

        while(!rootFolder && i < 100){
	        if(fs.existsSync(array.join('/')) && fs.lstatSync(array.join('/')).isDirectory() ){
		        const files = fs.readdirSync(array.join('/'));
		
		        if(files.indexOf('tsconfig.json') > -1){
			        rootFolder = array.join('/');
			        break;
		        }
	        }
			
            array.pop();
            i++;
        }

        if(!fs.existsSync(rootFolder)){
            throw new Error(`Pasta raiz não encontrada`);
        }

        if(fs.existsSync(rootFolder + '/.gitignore')){
            for(const line of fs.readFileSync(rootFolder + '/.gitignore').toString().split("\n")){
                ignoredFolders.push(line)
            }
        }

        return [
			{
				role: 'system', 
				content: 
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` + 
					`Essa é uma lista dos arquivos do sistema:\n` + 
					`\`\`\`${recursivelyListFiles(rootFolder, ignoredFolders).join("\n")}\`\`\``
			}
        ]
    }
}
