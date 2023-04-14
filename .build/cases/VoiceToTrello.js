"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Api_1 = __importDefault(require("../classes/Api"));
const DurinnGPT_1 = __importDefault(require("../classes/DurinnGPT"));
const VoiceToText_1 = __importDefault(require("../classes/VoiceToText"));
class VoiceToTrello {
    static run(codeOrFile, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const fileDir = fs.existsSync(path.resolve(process.cwd(), codeOrFile))
                ? path.resolve(process.cwd(), codeOrFile)
                : codeOrFile;
            const text = yield VoiceToText_1.default.send(fileDir, verbose);
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
exports.default = VoiceToTrello;
