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
const Api_1 = __importDefault(require("./Api"));
const fs = __importStar(require("fs"));
const DurinnGPT_1 = __importDefault(require("./DurinnGPT"));
const inquirer = require('inquirer');
const colors = require('colors');
const path = require('path');
class PromptForCode {
    static getCodeOrFile(codeOrFile) {
        const self = this;
        const path = require('path');
        let code = codeOrFile;
        if (fs.existsSync(codeOrFile) || fs.existsSync(path.resolve(process.cwd(), codeOrFile))) {
            const dir = fs.existsSync(codeOrFile)
                ? codeOrFile
                : path.resolve(process.cwd(), codeOrFile);
            code = fs.readFileSync(dir).toString();
        }
        return code;
    }
    static beforeSendCall(api, codeOrFile, saveToFile) {
        return __awaiter(this, void 0, void 0, function* () {
            // It's a hook
        });
    }
    static send(codeOrFile, saveToFile, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            if (fs.existsSync(path.resolve(process.cwd(), codeOrFile))) {
                codeOrFile = path.resolve(process.cwd(), codeOrFile);
            }
            if (fs.existsSync(path.resolve(process.cwd(), saveToFile))) {
                saveToFile = path.resolve(process.cwd(), saveToFile);
            }
            let code = PromptForCode.getCodeOrFile(codeOrFile);
            let saveToFileCode = saveToFile ? PromptForCode.getCodeOrFile(saveToFile) : '';
            if (!code) {
                console.log(`${self.name}: ${self.description}`);
                console.log(`Usage: npm run durinn-gpt -- ${DurinnGPT_1.default.pascalToKebabCase(self.name)} <CODE> <FILE-TO-SAVE>`);
                return false;
            }
            console.log('this.prompt', this.prompt);
            console.log('this.ask', this.ask);
            const prompt = this.prompt.replace('{{CODE-OR-FILE}}', code).replace('{{SAVE-TO-FILE}}', saveToFileCode);
            const ask = `${this.ask}`.replace('{{CODE-OR-FILE}}', code).replace('{{SAVE-TO-FILE}}', saveToFileCode);
            const api = new Api_1.default();
            yield this.beforeSendCall(api, codeOrFile, saveToFile);
            if (verbose) {
                console.log('Contexto:', api.context);
                console.log('Prompt:', prompt.green);
                console.log('Ask:', ask.green);
            }
            const call = yield api.send([
                { role: 'system', content: prompt },
                { role: 'user', content: ask }
            ]);
            if (verbose && call.code && call.code.length) {
                console.log(call.code[0].red);
            }
            return call;
        });
    }
    static run(codeOrFile, saveToFile, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const api = yield PromptForCode.send(codeOrFile, saveToFile, verbose);
            if (!api) {
                return false;
            }
            if (!api.code[0]) {
                return console.error('❌ Nenhum código retornado', api);
            }
            if (saveToFile) {
                if (saveToFile.substr(0, 1) != '/') {
                    saveToFile = path.resolve(process.cwd(), saveToFile);
                }
                fs.copyFileSync(saveToFile, saveToFile + '.bk');
                fs.writeFileSync(saveToFile, api.code[0]);
                console.log('✅ Arquivo salvo em:', saveToFile);
                const answer = yield inquirer.prompt([
                    {
                        type: "confirm",
                        name: "continue",
                        message: "Deseja salvar?",
                        default: true,
                    },
                ]);
                if (!answer.continue) {
                    fs.copyFileSync(saveToFile + '.bk', saveToFile);
                    fs.rmSync(saveToFile + '.bk');
                    console.log("🙅‍♂️ Alterações revertidas");
                    process.exit(1);
                }
                fs.rmSync(saveToFile + '.bk');
                return api;
            }
            DurinnGPT_1.default.copyToClipboard(api.code[0]);
            console.log('✅ Código copiado para a área de transferência');
            return api;
        });
    }
}
PromptForCode.prompt = '';
PromptForCode.ask = '';
// Describe this what this class does
PromptForCode.description = 'Descrição não fornecida';
exports.default = PromptForCode;
