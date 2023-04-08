import PromptForCode from "../classes/PromptForCode";

export default class OptimizeCode extends PromptForCode {
	static prompt = `Sua tarefa é aplicar técnicas de refatoração, reduzir a complexidade do código e torná-lo mais modular e reutilizável sempre que possível sem perder sua compatibilidade com outros arquivos que podem importa-lo. Além disso, é importante que você inclua comentários relevantes e adicione TSDOC para documentar as funções e métodos em detalhes.`;
	static ask = `Com base nas instruções passadas, otimize esse bloco de código e retorne em markdown o novo código gerado completo entre (\`\`\`), sem explicações:`;
	static description = `Otimiza o código que passamos.`;
}
