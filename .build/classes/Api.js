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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Api {
    constructor() {
        this.context = [];
    }
    addContext(context) {
        this.context = this.context.concat(context);
        return this;
    }
    send(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const axios = require('axios');
            const apiKey = process.env.OPENAI_API_KEY;
            const response = yield axios.post('https://api.openai.com/v1/chat/completions', { "model": "gpt-3.5-turbo-0301", "messages": self.context.concat(messages) }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            return new Response(response.data.choices[0].message.content);
        });
    }
}
exports.default = Api;
class Response {
    constructor(text) {
        this.text = text;
        this.code = [];
        const self = this;
        (text.match(/```(.*)```/gis) || []).forEach((text) => {
            self.code.push(text.substr(3, text.length - 6));
        });
    }
}
exports.Response = Response;
