"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
const Default_Model_1 = __importDefault(require("../defaults/Default.Model"));
const Default_Interface_1 = __importDefault(require("../defaults/Default.Interface"));
class GenerateInterface extends PromptForCode_1.default {
}
exports.default = GenerateInterface;
GenerateInterface.prompt = `
Vou fornecer alguns exemplos para que você grave o contexto:

Esse é um exemplo de classe padrão do nosso sistema:

\`\`\`
${Default_BaseModel_1.default}
\`\`\`

Esse é um exemplo de model do nosso sistema:

\`\`\`
${Default_Model_1.default}
\`\`\`

E essa é a interface desse model:

\`\`\`
${Default_Interface_1.default}
\`\`\``;
GenerateInterface.ask = `Com base no exemplo acima, gera apenas a interface do seguinte model:`;
GenerateInterface.description = `Gera uma interface a partir do código que passamos.`;
