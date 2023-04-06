"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PromptForCode_1 = __importDefault(require("@durinnGPT/classes/PromptForCode"));
class GenerateMigration extends PromptForCode_1.default {
}
exports.default = GenerateMigration;
GenerateMigration.prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder apenas o código. Sem explicações.`;
GenerateMigration.ask = ``;
GenerateMigration.description = `Gera uma migration do Sequelize a partir das instruções que passamos. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;
