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
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("../defaults/Default.Model"));
const Default_Migration_1 = __importDefault(require("../defaults/Default.Migration"));
class GenerateMigrationFromModel extends PromptForCode_1.default {
    static run(codeOrFile, saveToFile) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (saveToFile) {
                const moment = require("moment");
                saveToFile = `${moment().format(`YYYYMMDDHHmmss`)}-${saveToFile}`;
            }
            _super.run.call(this, codeOrFile, saveToFile);
        });
    }
}
GenerateMigrationFromModel.prompt = `
Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${Default_BaseModel_1.default}
\`\`\`

Esse é um exemplo de model do nosso sistema:

\`\`\`
${Default_Model_1.default}
\`\`\`

E essa é a migration que gerou esse model:

\`\`\`
${Default_Migration_1.default}
\`\`\``;
GenerateMigrationFromModel.ask = `Com base no modelo acima, gere uma sequelize ORM migration à partir deste model, use o padrão camelCase e adicione comentários nas colunas sempre que possível. Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código: \n\`\`\`\n{{CODE-OR-FILE}}\`\`\``;
GenerateMigrationFromModel.description = `Gera uma migration a partir do código de um model que passamos.`;
exports.default = GenerateMigrationFromModel;
