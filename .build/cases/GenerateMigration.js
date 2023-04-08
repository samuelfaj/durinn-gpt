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
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Intelligence_1 = __importDefault(require("../classes/Intelligence"));
class GenerateMigration extends PromptForCode_1.default {
    static beforeSendCall(api, codeOrFile, saveToFile) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Disparando beforeSendCall...`);
            let file = '';
            if (codeOrFile.substr(0, 1) != '/') {
                console.log('path.resolve(process.env.PWD as string, codeOrFile)', path.resolve(process.env.PWD, codeOrFile));
                codeOrFile = path.resolve(process.env.PWD, codeOrFile);
            }
            if (fs.existsSync(codeOrFile)) {
                file = codeOrFile;
            }
            if (saveToFile) {
                if (saveToFile.substr(0, 1) != '/') {
                    console.log('path.resolve(process.env.PWD as string, saveToFile)', path.resolve(process.env.PWD, saveToFile));
                    saveToFile = path.resolve(process.env.PWD, saveToFile);
                }
                if (fs.existsSync(saveToFile)) {
                    file = saveToFile;
                }
            }
            if (!file) {
                console.log(`Nenhum arquivo encontrado para disparar beforeSendCall`);
                return;
            }
            api.addContext(yield Intelligence_1.default.getTsConfig(file));
            api.addContext(yield Intelligence_1.default.getListOfFiles(file));
        });
    }
    static run(codeOrFile, saveToFile) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (saveToFile && saveToFile.substr(0, 1) != '/') {
                const arr = saveToFile.split('/');
                let filename = arr.pop();
                const moment = require("moment");
                filename = `${moment().format(`YYYYMMDDHHmmss`)}-${filename}`;
                arr.push(filename);
                saveToFile = arr.join('/');
            }
            _super.run.call(this, codeOrFile, saveToFile);
        });
    }
}
GenerateMigration.prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;
GenerateMigration.ask = `{{CODE-OR-FILE}}`;
GenerateMigration.description = `Gera uma migration do Sequelize a partir das instruções que passamos, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;
exports.default = GenerateMigration;
