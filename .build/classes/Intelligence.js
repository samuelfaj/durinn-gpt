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
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("../defaults/Default.Model"));
const Default_Interface_1 = __importDefault(require("../defaults/Default.Interface"));
const Default_Migration_1 = __importDefault(require("../defaults/Default.Migration"));
const fs = __importStar(require("fs"));
const path = require('path');
class Intelligence {
    /**
     * Resolve o caminho do arquivo a partir do diretório atual.
     * @param filePath - Caminho do arquivo a ser verificado.
     * @returns O caminho formatado.
     */
    static resolvePath(filePath) {
        var _a, _b;
        return fs.existsSync(filePath)
            ? (_b = (_a = path.resolve) === null || _a === void 0 ? void 0 : _a.call(path, process.cwd(), filePath)) === null || _b === void 0 ? void 0 : _b.toString()
            : filePath;
    }
    /**
     * Encontra o diretório raiz que contém o arquivo tsconfig.json.
     * @param modelDir - Diretório para iniciar a busca.
     * @returns O diretório raiz encontrado ou nulo.
     */
    static findRootFolder(modelDir) {
        const array = modelDir.split("/");
        let rootFolder = null;
        let i = 0;
        while (!rootFolder && i < 100) {
            const currentPath = array.join("/");
            if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
                const files = fs.readdirSync(currentPath);
                if (files.indexOf("tsconfig.json") > -1) {
                    rootFolder = currentPath;
                    break;
                }
            }
            array.pop();
            i++;
        }
        return rootFolder;
    }
    /**
     * Lista recursivamente todos os arquivos em um diretório, ignorando os diretórios especificados.
     * @param directory - Diretório para iniciar a busca.
     * @param ignoredFolders - Lista de diretórios a serem ignorados.
     * @returns Uma lista de arquivos encontrados.
     */
    static recursivelyListFiles(directory, ignoredFolders = []) {
        const self = this;
        const files = [];
        const currentFiles = fs.readdirSync(directory);
        currentFiles.forEach((file) => {
            var _a;
            const fullPath = (_a = path.join) === null || _a === void 0 ? void 0 : _a.call(path, directory, file);
            if (fs.statSync(fullPath).isDirectory() && !ignoredFolders.includes(file)) {
                files.push(...self.recursivelyListFiles(fullPath, ignoredFolders));
            }
            else {
                files.push(fullPath.replace(process.cwd(), ''));
            }
        });
        return files;
    }
    /**
     * Atualiza a lista de pastas ignoradas com base no arquivo .gitignore, se existir.
     * @param rootFolder - Diretório raiz do projeto.
     * @param ignoredFolders - Lista de pastas ignoradas.
     */
    static updateIgnoredFolders(rootFolder, ignoredFolders) {
        const gitignorePath = rootFolder + "/.gitignore";
        if (fs.existsSync(gitignorePath)) {
            for (const line of fs.readFileSync(gitignorePath).toString().split("\n")) {
                ignoredFolders.push(line);
            }
        }
    }
    /**
     * Retorna uma lista de mensagens com exemplos de código padrão do sistema.
     * @returns Uma lista de mensagens contendo exemplos de código padrão.
     */
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
    /**
     * Retorna a configuração TS a partir do diretório raiz do projeto ou do caminho do arquivo especificado.
     * @param filePath - Caminho opcional do arquivo a ser verificado.
     * @returns Uma lista de mensagens com informações do arquivo tsconfig.json encontrado.
     */
    static getTsConfig(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelDir = filePath ? this.resolvePath(filePath) : process.cwd();
            const rootFolder = this.findRootFolder(modelDir);
            if (!rootFolder) {
                throw new Error("Pasta raiz não encontrada");
            }
            return [
                {
                    role: "system",
                    content: "Vou fornecer alguns exemplos para que você grave o contexto:\n" +
                        "Essa é o tsconfig.json do sistema:\n" +
                        `\`\`\`${fs.readFileSync(rootFolder + "/tsconfig.json").toString()}\`\`\``,
                },
            ];
        });
    }
    /**
     * Retorna uma lista de arquivos do diretório raiz do projeto ou do caminho especificado.
     * @param filePath - Caminho opcional do arquivo a ser verificado.
     * @returns Uma lista de mensagens contendo informações dos arquivos encontrados.
     */
    static getListOfFiles(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const ignoredFolders = [".git", ".build", ".serverless", "node_modules", ".idea"];
            const modelDir = filePath ? self.resolvePath(filePath) : process.cwd();
            const rootFolder = self.findRootFolder(modelDir);
            if (!rootFolder) {
                throw new Error("Pasta raiz não encontrada");
            }
            self.updateIgnoredFolders(rootFolder, ignoredFolders);
            const filesList = self.recursivelyListFiles(rootFolder, ignoredFolders);
            return [
                {
                    role: "system",
                    content: "Vou fornecer alguns exemplos para que você grave o Messageso:\n" +
                        "Essa é uma lista dos arquivos do sistema:\n" +
                        `\`\`\`\n${filesList.join("\n")}\n\`\`\``,
                },
            ];
        });
    }
}
exports.default = Intelligence;
