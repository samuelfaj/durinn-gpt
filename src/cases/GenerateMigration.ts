import PromptForCode from "../classes/PromptForCode";

export default class GenerateMigration extends PromptForCode {
	static prompt = `Sua missão é criar uma migration usando a biblioteca Sequelize ORM. Essa migration deve usar transaction e você deve responder apenas o código. Sem explicações.`;
	static ask = ``;
	static description = `Gera uma migration do Sequelize a partir das instruções que passamos. Exemplo: Crie uma migration adicionando o campo nome (string) na tabela Usuários`;
}
