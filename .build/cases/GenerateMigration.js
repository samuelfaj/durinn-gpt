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
const Default_Migration_1 = __importDefault(require("../defaults/Default.Migration"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
class GenerateMigration extends PromptForCode_1.default {
    static beforeSendCall(api, codeOrFile, saveToFile) {
        return __awaiter(this, void 0, void 0, function* () {
            // api.addContext(await Intelligence.getTsConfig())
            // api.addContext(await Intelligence.getListOfFiles())
        });
    }
    static run(codeOrFile, saveToFile, verbose = false) {
        const _super = Object.create(null, {
            ask: { get: () => super.ask, set: v => super.ask = v },
            description: { get: () => super.description, set: v => super.description = v },
            run: { get: () => super.run, set: v => super.run = v }
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
            _super.ask = this.ask;
            _super.description = this.description;
            _super.run.call(this, codeOrFile, saveToFile, verbose);
        });
    }
}
GenerateMigration.prompt = `
Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${Default_BaseModel_1.default}
\`\`\`

Esse é um exemplo de migration do nosso sistema:

\`\`\`
${Default_Migration_1.default}
\`\`\`

Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder em markdown apenas o código novo entre (\`\`\`). Sem explicações.`;
GenerateMigration.ask = `{{CODE-OR-FILE}}`;
GenerateMigration.description = `Gera uma migration do Sequelize a partir das instruções que passamos, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;
exports.default = GenerateMigration;
