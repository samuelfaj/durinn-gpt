"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
class UpdateInterfaceFromModel extends PromptForCode_1.default {
}
UpdateInterfaceFromModel.description = `Atualiza uma interface com base em um model que passamos.`;
UpdateInterfaceFromModel.prompt = `Vou fornecer alguns exemplos para que você grave o contexto:\n\n` +
    `Esse é um exemplo de classe padrão do nosso sistema:\n\n` +
    `\`\`\`\n` +
    `${Default_BaseModel_1.default}\n` +
    `\`\`\`\n\n` +
    `Esse é o model do nosso sistema:\n\n` +
    `\`\`\`\n` +
    `{{CODE-OR-FILE}}\n` +
    `\`\`\``;
UpdateInterfaceFromModel.ask = `Com base no model acima, atualize a interface abaixo para que seja fiel ao model, você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n\`\`\`\n{{SAVE-TO-FILE}}\`\`\``;
exports.default = UpdateInterfaceFromModel;
