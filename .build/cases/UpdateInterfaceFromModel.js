"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
const Default_Interface_1 = __importDefault(require("../defaults/Default.Interface"));
class UpdateInterfaceFromModel extends PromptForCode_1.default {
}
UpdateInterfaceFromModel.description = `Atualiza uma interface com base em um model que passamos.`;
UpdateInterfaceFromModel.prompt = `Vou fornecer alguns exemplos para que você grave o contexto:\n\n` +
    // `Esse é um exemplo de classe padrão do nosso sistema:\n\n`+ 
    // `\`\`\`\n`+ 
    // `${DefaultBaseModel}\n`+ 
    // `\`\`\`\n\n` + 
    `Esse é um exemplo de interface padrão do nosso sistema:\n\n` +
    `\`\`\`\n` +
    `${Default_Interface_1.default}\n` +
    `\`\`\`\n\n` +
    `Esse é o model a ser analisado:\n\n` +
    `\`\`\`\n` +
    `{{CODE-OR-FILE}}\n` +
    `\`\`\``;
UpdateInterfaceFromModel.ask = `As interfaces do sistema são arquivos que nos dão uma definição dos campos existentes no model e nós compartilhamos esses arquivos com o frontend.\n` +
    `Atualize a interface abaixo, adicionando os campos que existem no model mas não existem nele ou removendo os que existem nele mas não existem no model.\n` +
    `Você deve responder em markdown apenas o novo código e entre (\`\`\`). Sem explicações. Apenas o novo código.\n` +
    `\`\`\`\n{{SAVE-TO-FILE}}\n\`\`\``;
exports.default = UpdateInterfaceFromModel;
