"use strict";
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
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("../defaults/Default.Model"));
const Default_Interface_1 = __importDefault(require("../defaults/Default.Interface"));
const Default_Migration_1 = __importDefault(require("src/defaults/Default.Migration"));
const fs = require('fs');
const path = require('path');
class Intelligence {
    static getDefaultContext() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Esse é um exemplo de classe padrão do nosso sistema:\n` +
                        `\`\`\`${Default_BaseModel_1.default}\`\`\``
                },
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Esse é um exemplo de model do nosso sistema:\n` +
                        `\`\`\`${Default_Model_1.default}\`\`\``
                },
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Esse é um exemplo de model de interface do nosso sistema:\n` +
                        `\`\`\`${Default_Interface_1.default}\`\`\``
                },
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Esse é um exemplo de model de migration do nosso sistema:\n` +
                        `\`\`\`${Default_Migration_1.default}\`\`\``
                }
            ];
        });
    }
    static getTsConfig(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelDir = fs.existsSync(filePath)
                ? filePath
                : path.resolve(process.env.PWD, filePath);
            const array = modelDir.split('/');
            const modelName = array.pop().replace('.ts', '');
            let i = 0;
            let rootFolder = null;
            while (!rootFolder && i < 100) {
                const files = fs.readdirSync(array.join('/'));
                if (files.indexOf('tsconfig.json') > -1) {
                    rootFolder = array.join('/');
                    break;
                }
                array.pop();
                i++;
            }
            if (!fs.existsSync(rootFolder)) {
                throw new Error(`Pasta raiz não encontrada`);
            }
            return [
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Essa é o tsconfig.json do sistema:\n` +
                        `\`\`\`${fs.readFileSync(rootFolder + '/tsconfig.json').toString()}\`\`\``
                }
            ];
        });
    }
    static getListOfFiles(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const ignoredFolders = ['.git', '.build'];
            const recursivelyListFiles = (directory, ignoredFolders = []) => {
                const files = [];
                // list all files in the current directory
                const currentFiles = fs.readdirSync(directory);
                // iterate over each found file
                currentFiles.forEach((file) => {
                    // create the full path to the file
                    const fullPath = path.join(directory, file);
                    // check if the path is a directory and not in the ignored folders list
                    if (fs.statSync(fullPath).isDirectory() && !ignoredFolders.includes(file)) {
                        // if it is a directory and not ignored, recursively list its files
                        files.push(...recursivelyListFiles(fullPath, ignoredFolders));
                    }
                    else {
                        // if it is a file or an ignored directory, add it to the list of files
                        files.push(fullPath);
                    }
                });
                return files;
            };
            const modelDir = fs.existsSync(filePath)
                ? filePath
                : path.resolve(process.env.PWD, filePath);
            const array = modelDir.split('/');
            const modelName = array.pop().replace('.ts', '');
            let i = 0;
            let rootFolder = null;
            while (!rootFolder && i < 100) {
                const files = fs.readdirSync(array.join('/'));
                if (files.indexOf('tsconfig.json') > -1) {
                    rootFolder = array.join('/');
                    break;
                }
                array.pop();
                i++;
            }
            if (!fs.existsSync(rootFolder)) {
                throw new Error(`Pasta raiz não encontrada`);
            }
            if (fs.existsSync(rootFolder + '/.gitignore')) {
                for (const line of fs.readFileSync(rootFolder + '/.gitignore').toString().split("\n")) {
                    ignoredFolders.push(line);
                }
            }
            return [
                {
                    role: 'system',
                    content: `Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
                        `Essa é uma lista dos arquivos do sistema:\n` +
                        `\`\`\`${recursivelyListFiles(rootFolder, ignoredFolders).join("\n")}\`\`\``
                }
            ];
        });
    }
}
exports.default = Intelligence;
