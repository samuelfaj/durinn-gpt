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
const Api_1 = __importDefault(require("../classes/Api"));
const DurinnGPT_1 = __importDefault(require("../classes/DurinnGPT"));
class TextToTrello {
    static run(text, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const api = new Api_1.default();
            const call = yield api.send([
                // {role: 'system', content: prompt},
                { role: 'user', content: `Quero que você aja como o gerente de projetos de um time de desenvolvimento de sistemas. Entenda a requisição deste cliente e monte um card no trello para o roadmap de desenvolvimento de sistemas:

"${text}"

Sugira:
- Título do cartão: 
- Descrição do cartão 
- Checklist
- Prioridade` }
            ]);
            if (!call.text) {
                return console.error('❌ Nenhum texto retornado');
            }
            console.log("-----------------------------------------\n\n");
            console.log(call.text);
            console.log("\n\n-----------------------------------------\n");
            DurinnGPT_1.default.copyToClipboard(call.text);
            console.log('✅ Código copiado para a área de transferência');
            return call;
        });
    }
}
exports.default = TextToTrello;
