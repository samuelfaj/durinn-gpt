import GenerateInterface from "../cases/GenerateInterface";
import GenerateMigration from "../cases/GenerateMigration";
import GenerateMigrationFromModel from "../cases/GenerateMigrationFromModel";
import GenerateModelFromMigration from "../cases/GenerateModelFromMigration";
import OptimizeCode from "../cases/OptimizeCode";
import UpdateModelFromMigration from "../cases/UpdateModelFromMigration";
import UpdateInterfaceFromModel from "../cases/UpdateInterfaceFromModel";

import colors from "colors";
require('colors');

export default class DurinnGPT {
	/**
	 * Get the command line arguments and return an object with these arguments.
	 * The arguments can be passed with or without the '--' syntax.
	 * @param {string[]} argv - The command line arguments array.
	 * @returns {Args} - An object with the processed arguments.
	 */
	static getArguments(argv: string[]): { [key: string]: string; } {
		return argv.reduce((acc: { [key: string]: string; }, arg: string, index: number, arr: string[]): { [key: string]: string; } => {
			let key: string;
			let value: string;
			
			// If the argument starts with '--', it's a key-value pair with an '=' delimiter
			if (arg.startsWith('--')) {
				[key, value] = arg.substring(2).split('=');
			} else if (index % 2 === 0) {
				// If the index is even, it's a key and the next index is its value
				key = arg;
				value = arr[index + 1];
			}
			
			// If a valid key and value exist, add them to the accumulator object
			// @ts-ignore
			if (key && value !== undefined) {
				acc[key] = value;
			}
			
			return acc;
		}, {});
	}
	
	/**
	 * Converts a kebab-case string to PascalCase.
	 * @param input - The kebab-case string to be converted.
	 * @returns The converted PascalCase string.
	 */
	static kebabToPascalCase(input: string): string {
		// Split the input string at hyphens
		const words = input.split('-');
		
		// Map each word to have the first letter capitalized
		const capitalizedWords = words.map(DurinnGPT.capitalizeFirstLetter);
		
		// Join the capitalized words without spaces
		const pascalCase = capitalizedWords.join('');
		
		return pascalCase;
	}
	
	/**
	 * Converts a PascalCase string to kebab-case.
	 * @param input - The PascalCase string to be converted.
	 * @returns The converted kebab-case string.
	 */
	static pascalToKebabCase(input: string): string {
		// Convert the input string to an array of words by splitting at uppercase letters
		const words = input.split(/(?=[A-Z])/);
		
		// Map each word to have the first letter lowercased
		const lowercasedWords = words.map(word => word.charAt(0).toLowerCase() + word.slice(1));
		
		// Join the lowercased words with hyphens
		const kebabCase = lowercasedWords.join('-');
		
		return kebabCase;
	}
	
	/**
	 * Capitalizes the first letter of the input string.
	 * @param word - The input string to be capitalized.
	 * @returns The capitalized string.
	 */
	static capitalizeFirstLetter(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}
	
	/**
	 * Copy text to the clipboard
	 * @param data
	 */
	static copyToClipboard(data: string | number) {
		const proc = require('child_process').spawn('pbcopy');
		proc.stdin.write(data); proc.stdin.end();
	}
	
	static classes() {
		return {
			GenerateInterface,
			GenerateMigration,
			GenerateMigrationFromModel,
			GenerateModelFromMigration,
			OptimizeCode,
			UpdateModelFromMigration,
			UpdateInterfaceFromModel
		};
	}
	
	static printUsage(){
		console.log(`DurinnGPT - A helper for integrate IA on our code.\n`);
		console.log('Possible Commands:')
		const classes = DurinnGPT.classes() as any;
		for(const name in classes){
			const _class = classes[name];
			console.log(`   *`,`${DurinnGPT.pascalToKebabCase(name)}`.yellow,`${_class.description}`);
		}
	}
	
	static run(){
		const self = this;
		const argv = process.argv.slice(2);
		const args = process.argv.slice(3);
		const formattedArgs = DurinnGPT.getArguments(argv); // Log the processed arguments object
		const classes = self.classes() as any;
		
		if(!argv[0]){
			return DurinnGPT.printUsage();
		}
		
		const _class = DurinnGPT.kebabToPascalCase(argv[0]);
		
		if(classes[_class]){
			return (classes[_class]).run(...args);
		}
		
		return DurinnGPT.printUsage();
	}
}
