"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateInterface_1 = __importDefault(require("../cases/GenerateInterface"));
const GenerateMigration_1 = __importDefault(require("../cases/GenerateMigration"));
const GenerateMigrationFromModel_1 = __importDefault(require("../cases/GenerateMigrationFromModel"));
const GenerateModelFromMigration_1 = __importDefault(require("../cases/GenerateModelFromMigration"));
const OptimizeCode_1 = __importDefault(require("../cases/OptimizeCode"));
const UpdateModelFromMigration_1 = __importDefault(require("src/cases/UpdateModelFromMigration"));
const UpdateInterfaceFromModel_1 = __importDefault(require("src/cases/UpdateInterfaceFromModel"));
class DurinnGPT {
    /**
     * Get the command line arguments and return an object with these arguments.
     * The arguments can be passed with or without the '--' syntax.
     * @param {string[]} argv - The command line arguments array.
     * @returns {Args} - An object with the processed arguments.
     */
    static getArguments(argv) {
        return argv.reduce((acc, arg, index, arr) => {
            let key;
            let value;
            // If the argument starts with '--', it's a key-value pair with an '=' delimiter
            if (arg.startsWith('--')) {
                [key, value] = arg.substring(2).split('=');
            }
            else if (index % 2 === 0) {
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
    static kebabToPascalCase(input) {
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
    static pascalToKebabCase(input) {
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
    static capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    /**
     * Copy text to the clipboard
     * @param data
     */
    static copyToClipboard(data) {
        const proc = require('child_process').spawn('pbcopy');
        proc.stdin.write(data);
        proc.stdin.end();
    }
    static classes() {
        return {
            GenerateInterface: GenerateInterface_1.default,
            GenerateMigration: GenerateMigration_1.default,
            GenerateMigrationFromModel: GenerateMigrationFromModel_1.default,
            GenerateModelFromMigration: GenerateModelFromMigration_1.default,
            OptimizeCode: OptimizeCode_1.default,
            UpdateModelFromMigration: UpdateModelFromMigration_1.default,
            UpdateInterfaceFromModel: UpdateInterfaceFromModel_1.default
        };
    }
    static printUsage() {
        console.log(`DurinnGPT - A helper for integrate IA on our code.\n`);
        console.log('Possible Commands:');
        const classes = DurinnGPT.classes();
        for (const name in classes) {
            const _class = classes[name];
            console.log(`   * ${name}: ${_class.description}`);
        }
    }
    static run() {
        const self = this;
        const argv = process.argv.slice(2);
        const args = process.argv.slice(3);
        const formattedArgs = DurinnGPT.getArguments(argv); // Log the processed arguments object
        const classes = self.classes();
        if (!argv[0]) {
            return DurinnGPT.printUsage();
        }
        const _class = DurinnGPT.kebabToPascalCase(argv[0]);
        if (classes[_class]) {
            return (classes[_class]).run(...args);
        }
        return DurinnGPT.printUsage();
    }
}
exports.default = DurinnGPT;
