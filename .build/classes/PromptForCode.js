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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = __importDefault(require("./Api"));
const fs = __importStar(require("fs"));
const DurinnGPT_1 = __importDefault(require("./DurinnGPT"));
class PromptForCode {
    static run(code, saveToFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            if (!code) {
                console.log(`${self.name}: ${self.description}`);
                console.log(`Usage: npm run durinn-gpt -- ${DurinnGPT_1.default.pascalToKebabCase(self.name)} <CODE> <FILE-TO-SAVE>`);
                return;
            }
            const api = yield Api_1.default.send([
                { role: 'system', content: this.prompt },
                { role: 'user', content: `${this.ask}\n\`\`\`\n${code}\`\`\`` }
            ]);
            if (!api.code[0]) {
                return console.error(`Nenhum código retornado`, api);
            }
            if (saveToFile) {
                fs.writeFileSync(saveToFile, api.code[0]);
            }
            DurinnGPT_1.default.copyToClipboard(api.code[0]);
            console.log('Código copiado para a área de transferência');
            return api;
        });
    }
}
exports.default = PromptForCode;
PromptForCode.prompt = '';
PromptForCode.ask = '';
// Describe this what this class does
PromptForCode.description = 'Descrição não fornecida';
