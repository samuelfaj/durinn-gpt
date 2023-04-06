"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("@durinnGPT/classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("@durinnGPT/defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("@durinnGPT/defaults/Default.Model"));
const Default_Migration_1 = __importDefault(require("@durinnGPT/defaults/Default.Migration"));
class GenerateModelFromMigration extends PromptForCode_1.default {
}
exports.default = GenerateModelFromMigration;
GenerateModelFromMigration.prompt = `
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
GenerateModelFromMigration.ask = `Com base no modelo acima, gere um model à partir desta migration:`;
GenerateModelFromMigration.description = `Gera um model a partir do código de uma migration que passamos.`;
