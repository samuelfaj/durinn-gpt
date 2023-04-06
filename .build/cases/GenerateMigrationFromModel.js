"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("../defaults/Default.Model"));
const Default_Migration_1 = __importDefault(require("../defaults/Default.Migration"));
class GenerateMigrationFromModel extends PromptForCode_1.default {
}
exports.default = GenerateMigrationFromModel;
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
GenerateMigrationFromModel.ask = `Com base no modelo acima, gere uma sequelize ORM migration à partir deste model:`;
GenerateMigrationFromModel.description = `Gera uma migration a partir do código de um model que passamos.`;
