"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_BaseModel_1 = __importDefault(require("../defaults/Default.BaseModel"));
class UpdateModelFromMigration extends PromptForCode_1.default {
}
UpdateModelFromMigration.description = `Atualiza um model com base em uma migration que passamos.`;
UpdateModelFromMigration.prompt = `Vou fornecer alguns exemplos para que você grave o contexto:\n\n` +
    `Esse é um exemplo de classe padrão do nosso sistema:\n\n` +
    `\`\`\`\n` +
    `${Default_BaseModel_1.default}\n` +
    `\`\`\`\n\n` +
    `Esse é o model do nosso sistema:\n\n` +
    `\`\`\`\n` +
    `{{SAVE-TO-FILE}}\n` +
    `\`\`\``;
UpdateModelFromMigration.ask = `Com base no modelo acima, aplique no model as alterações propostas na migration abaixo, você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n\`\`\`\n{{CODE-OR-FILE}}\`\`\``;
exports.default = UpdateModelFromMigration;
