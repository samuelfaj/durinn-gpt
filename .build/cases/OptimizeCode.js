"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("../classes/PromptForCode"));
class OptimizeCode extends PromptForCode_1.default {
}
OptimizeCode.prompt = `Sua tarefa é aplicar técnicas de refatoração, reduzir a complexidade do código e torná-lo mais modular e reutilizável sempre que possível sem perder sua compatibilidade com outros arquivos que podem importa-lo. Além disso, é importante que você inclua comentários relevantes e adicione TSDOC para documentar as funções e métodos em detalhes.`;
OptimizeCode.ask = `Com base nas instruções passadas, otimize esse bloco de código e retorne em markdown o novo código gerado completo entre (\`\`\`), sem explicações:`;
OptimizeCode.description = `Otimiza o código que passamos.`;
exports.default = OptimizeCode;
