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
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
class GenerateMigration extends PromptForCode_1.default {
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
