"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const UpdateInterfaceFromModel_1 = __importDefault(require("./UpdateInterfaceFromModel"));
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const GenerateMigration_1 = __importDefault(require("./GenerateMigration"));
const inquirer = require('inquirer');
const path = require('path');
class EditModel extends PromptForCode_1.default {
    static editModel(codeOrFile, saveToFile, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            EditModel.prompt = `Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${Default_BaseModel_1.default}
\`\`\`

Esse é o model do nosso sistema:

\`\`\`
{{SAVE-TO-FILE}}
\`\`\``;
            EditModel.ask = `Com base no model acima, faça as atualizações requisitadas abaixo. Você deve responder em markdown apenas o código e entre (\`\`\`). Sem explicações.\n Faça o seguinte: "{{CODE-OR-FILE}}"`;
            const dir = fs.existsSync(saveToFile)
                ? saveToFile
                : path.resolve(process.env.PWD, saveToFile);
            const api = yield EditModel.send(codeOrFile, saveToFile, verbose);
            if (api) {
                fs.copyFileSync(dir, dir + '.bk');
                fs.writeFileSync(dir, api.code[0]);
                EditModel.files.push(dir);
                EditModel.backups.push(dir + '.bk');
                console.log('✅', 'Arquivo salvo em:', dir);
            }
        });
    }
    static updateInterface(modelPath, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelDir = fs.existsSync(modelPath)
                ? modelPath
                : path.resolve(process.env.PWD, modelPath);
            const array = modelDir.split('/');
            const modelName = array.pop();
            const interfaceDir = modelDir.replace('/' + modelName, '/../interfaces/models/' + modelName.replace('.ts', '.interface.ts'));
            if (fs.existsSync(interfaceDir)) {
                const api = yield UpdateInterfaceFromModel_1.default.send(fs.readFileSync(modelDir).toString(), interfaceDir, verbose);
                if (api) {
                    fs.copyFileSync(interfaceDir, interfaceDir + '.bk');
                    fs.writeFileSync(interfaceDir, api.code[0]);
                    EditModel.files.push(interfaceDir);
                    EditModel.backups.push(interfaceDir + '.bk');
                    console.log('✅', 'Arquivo salvo em:', interfaceDir);
                }
            }
        });
    }
    static createMigration(toDo, modelPath, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelDir = fs.existsSync(modelPath)
                ? modelPath
                : path.resolve(process.env.PWD, modelPath);
            const array = modelDir.split('/');
            const modelName = array.pop().replace('.ts', '');
            let i = 0;
            let databaseFolder = null;
            while (!databaseFolder && i < 100) {
                if (fs.existsSync(array.join('/'))) {
                    const files = fs.readdirSync(array.join('/'));
                    if (files.indexOf('database') > -1) {
                        databaseFolder = array.join('/') + '/database';
                        break;
                    }
                }
                array.pop();
                i++;
            }
            if (!databaseFolder || !fs.existsSync(databaseFolder)) {
                console.error(`❌ Pasta das migrations não encontrada`, databaseFolder);
            }
            const moment = require("moment");
            const migrationDir = databaseFolder + `/${moment().format(`YYYYMMDDHHmmss`)}-adjusts-to-${modelName}.js`;
            const api = yield GenerateMigration_1.default.send(`Crie uma migration que faça o seguinte com a tabela ${modelName}: ${toDo}`, migrationDir, verbose);
            if (api) {
                fs.writeFileSync(migrationDir, api.code[0]);
                EditModel.files.push(migrationDir);
                console.log('✅', 'Arquivo salvo em:', migrationDir);
            }
        });
    }
    static run(toDo, saveToFile, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            EditModel.files = [];
            console.log('Editando model...');
            yield EditModel.editModel(toDo, saveToFile, verbose);
            console.log('Editando interface...');
            yield EditModel.updateInterface(saveToFile, verbose);
            console.log('Gerando migration...');
            yield EditModel.createMigration(toDo, saveToFile, verbose);
            const answer = yield inquirer.prompt([
                {
                    type: "confirm",
                    name: "continue",
                    message: "Deseja salvar as alterações?",
                    default: true,
                },
            ]);
            if (!answer.continue) {
                for (const file of self.files) {
                    fs.rmSync(file);
                }
                for (const file of self.backups) {
                    fs.copyFileSync(file, file.replace('.bk', ''));
                    fs.rmSync(file);
                }
                console.log("🙅‍♂️ Alterações revertidas");
                process.exit(1);
            }
            for (const file of self.backups) {
                fs.rmSync(file);
            }
            return true;
        });
    }
}
EditModel.files = [];
EditModel.backups = [];
EditModel.description = `Edita um model, atualiza a interface e cria uma migration.`;
exports.default = EditModel;
