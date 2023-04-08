import DefaultBaseModel from "../defaults/Default.BaseModel";
import DefaultModel from "../defaults/Default.Model";
import DefaultInterface from "../defaults/Default.Interface";
import DefaultMigration from "../defaults/Default.Migration";

import {Messages} from "./Api";
import * as fs from "fs";

const path = require('path');

export default class Intelligence {
	/**
	 * Resolve o caminho do arquivo a partir do diretório atual.
	 * @param filePath - Caminho do arquivo a ser verificado.
	 * @returns O caminho formatado.
	 */
	protected static resolvePath(filePath: string): string {
		return fs.existsSync(filePath)
			? path.resolve?.(process.cwd(), filePath)?.toString()
			: filePath;
	}
	
	/**
	 * Encontra o diretório raiz que contém o arquivo tsconfig.json.
	 * @param modelDir - Diretório para iniciar a busca.
	 * @returns O diretório raiz encontrado ou nulo.
	 */
	protected static findRootFolder(modelDir: string): string | null {
		const array = modelDir.split("/");
		let rootFolder = null;
		let i = 0;
		
		while (!rootFolder && i < 100) {
			const currentPath = array.join("/");
			
			if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
				const files = fs.readdirSync(currentPath);
				
				if (files.indexOf("tsconfig.json") > -1) {
					rootFolder = currentPath;
					break;
				}
			}
			
			array.pop();
			i++;
		}
		
		return rootFolder;
	}
	
	/**
	 * Lista recursivamente todos os arquivos em um diretório, ignorando os diretórios especificados.
	 * @param directory - Diretório para iniciar a busca.
	 * @param ignoredFolders - Lista de diretórios a serem ignorados.
	 * @returns Uma lista de arquivos encontrados.
	 */
	protected static recursivelyListFiles(directory: string, ignoredFolders: string[] = []): string[] {
		const self = this;
		const files: string[] = [];
		const currentFiles = fs.readdirSync(directory);
		
		currentFiles.forEach((file: string) => {
			const fullPath = path.join?.(directory, file) as string;
			
			if (fs.statSync(fullPath).isDirectory() && !ignoredFolders.includes(file)) {
				files.push(...self.recursivelyListFiles(fullPath, ignoredFolders));
			} else {
				files.push(fullPath.replace(process.cwd(), ''));
			}
		});
		
		return files;
	}
	
	/**
	 * Atualiza a lista de pastas ignoradas com base no arquivo .gitignore, se existir.
	 * @param rootFolder - Diretório raiz do projeto.
	 * @param ignoredFolders - Lista de pastas ignoradas.
	 */
	protected static updateIgnoredFolders(rootFolder: string, ignoredFolders: string[]): void {
		const gitignorePath = rootFolder + "/.gitignore";
		
		if (fs.existsSync(gitignorePath)) {
			for (const line of fs.readFileSync(gitignorePath).toString().split("\n")) {
				ignoredFolders.push(line);
			}
		}
	}
	
	/**
	 * Retorna uma lista de mensagens com exemplos de código padrão do sistema.
	 * @returns Uma lista de mensagens contendo exemplos de código padrão.
	 */
	static async getDefaultContext(): Promise<Messages>{
        return [
			{
				role: 'system',
				content:
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
					`Esse é um exemplo de classe padrão do nosso sistema:\n` +
					`\`\`\`${DefaultBaseModel}\`\`\``
			},
			{
				role: 'system',
				content:
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
					`Esse é um exemplo de model do nosso sistema:\n` +
					`\`\`\`${DefaultModel}\`\`\``
			},
			{
				role: 'system',
				content:
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
					`Esse é um exemplo de model de interface do nosso sistema:\n` +
					`\`\`\`${DefaultInterface}\`\`\``
			},
			{
				role: 'system',
				content:
					`Vou fornecer alguns exemplos para que você grave o Messageso:\n` +
					`Esse é um exemplo de model de migration do nosso sistema:\n` +
					`\`\`\`${DefaultMigration}\`\`\``
			}
		];
	}
	
	/**
	 * Retorna a configuração TS a partir do diretório raiz do projeto ou do caminho do arquivo especificado.
	 * @param filePath - Caminho opcional do arquivo a ser verificado.
	 * @returns Uma lista de mensagens com informações do arquivo tsconfig.json encontrado.
	 */
	static async getTsConfig(filePath?: string): Promise<Messages> {
		const modelDir = filePath ? this.resolvePath(filePath) : process.cwd();
		const rootFolder = this.findRootFolder(modelDir);
		
		if (!rootFolder) {
			throw new Error("Pasta raiz não encontrada");
		}
		
		return [
			{
				role: "system",
				content:
					"Vou fornecer alguns exemplos para que você grave o contexto:\n" +
					"Essa é o tsconfig.json do sistema:\n" +
					`\`\`\`${fs.readFileSync(rootFolder + "/tsconfig.json").toString()}\`\`\``,
			},
		];
	}
	
	/**
	 * Retorna uma lista de arquivos do diretório raiz do projeto ou do caminho especificado.
	 * @param filePath - Caminho opcional do arquivo a ser verificado.
	 * @returns Uma lista de mensagens contendo informações dos arquivos encontrados.
	 */
	static async getListOfFiles(filePath?: string): Promise<Messages> {
		const self = this;
		const ignoredFolders = [".git", ".build", ".serverless", "node_modules", ".idea"];
		const modelDir = filePath ? self.resolvePath(filePath) : process.cwd();
		const rootFolder = self.findRootFolder(modelDir);
		
		if (!rootFolder) {
			throw new Error("Pasta raiz não encontrada");
		}
		
		self.updateIgnoredFolders(rootFolder, ignoredFolders);
		const filesList = self.recursivelyListFiles(rootFolder, ignoredFolders);
		
		return [
			{
				role: "system",
				content:
					"Vou fornecer alguns exemplos para que você grave o Messageso:\n" +
					"Essa é uma lista dos arquivos do sistema:\n" +
					`\`\`\`\n${filesList.join("\n")}\n\`\`\``,
			},
		];
	}
}
