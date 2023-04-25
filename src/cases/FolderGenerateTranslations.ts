import GenerateTranslations from "./GenerateTranslations";

const inquirer = require('inquirer');

export default class FolderGenerateTranslations {
	static async run(folderPath: string, verbose = false){
        const fs = require('fs');
        const path = require('path');

        const files = fs.readdirSync(folderPath);
        const backups: string[] = [];

        for(const file_name of files){
            if(file_name.indexOf('.bk') > -1){
                continue;
            }

            if(!/\.[a-z]+$/i.test(file_name)){
                continue;
            }

            const file = path.resolve(folderPath, file_name);
            const saveToFile = file;
            const originalCode = fs.readFileSync(file).toString();
            const newCode = await GenerateTranslations.process(file, file, verbose);

            fs.writeFileSync(file + '.bk', originalCode);
            fs.writeFileSync(file, newCode);

            console.log('✅ Arquivo salvo em:', file);
        }


		const answer = await inquirer.prompt([
			{
				type: "confirm",
				name: "continue",
				message: "Deseja salvar?",
				default: true,
			},
		]);

		if (!answer.continue) {
            for(const file of backups){
                fs.copyFileSync(file, file.replace('.bk', ''));
                fs.rmSync(file);
            }

			console.log("🙅‍♂️ Alterações revertidas");
			process.exit(1);
		}
		
        for(const file of backups){
            fs.rmSync(file);
        }
    }
}