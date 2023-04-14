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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
class VoiceToText {
    static convertToMp3(filePath, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const ext = path_1.default.extname(filePath);
                if (ext === '.mp3') {
                    return resolve(filePath);
                }
                const outputPath = filePath.replace(ext, '.' + (0, moment_1.default)().format('YYYYMMDDHHss') + '.mp3');
                if (verbose) {
                    console.log(`💻: ffmpeg -i "${filePath}" "${outputPath}"`);
                }
                (0, child_process_1.exec)(`ffmpeg -i "${filePath}" "${outputPath}"`, (error, stdout, stderr) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(outputPath);
                });
            });
        });
    }
    static send(filePath, verbose = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            if (verbose)
                console.log('Convertendo para mp3...');
            const mp3FilePath = yield this.convertToMp3(filePath);
            if (verbose)
                console.log('✅ Convertido');
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const apiKey = process.env.OPENAI_API_KEY;
                const form = new form_data_1.default();
                form.append('model', 'whisper-1');
                form.append('file', fs_1.default.createReadStream(mp3FilePath));
                if (verbose)
                    console.log('Enviando para a api...');
                const response = yield axios_1.default.post('https://api.openai.com/v1/audio/transcriptions', form, {
                    headers: Object.assign(Object.assign({}, form.getHeaders()), { Authorization: `Bearer ${apiKey}` }),
                });
                if (verbose)
                    console.log('✅ Resposta recebida');
                resolve(response.data.text);
            }));
        });
    }
}
exports.default = VoiceToText;
