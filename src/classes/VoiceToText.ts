import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import moment from 'moment';

export default class VoiceToText {
    static async convertToMp3(filePath: string, verbose: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            const ext = path.extname(filePath);

            if (ext === '.mp3') {
                return resolve(filePath);
            }
            
            const outputPath = filePath.replace(ext,  '.' + moment().format('YYYYMMDDHHss') + '.mp3');

            if(verbose){
                console.log(`💻: ffmpeg -i "${filePath}" "${outputPath}"`);
            }

            exec(`ffmpeg -i "${filePath}" "${outputPath}"`, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                } 
                
                resolve(outputPath);
            });
        });
    }

    static async send(filePath: string, verbose: boolean = false): Promise<string> {
        const self = this;

        if(verbose) console.log('Convertendo para mp3...');

        const mp3FilePath = await this.convertToMp3(filePath);
        
        if(verbose) console.log('✅ Convertido');

        return new Promise(async (resolve, reject) => {
            const apiKey = process.env.OPENAI_API_KEY;

            const form = new FormData();
            form.append('model', 'whisper-1');
            form.append('file', fs.createReadStream(mp3FilePath));

            if(verbose) console.log('Enviando para a api...');

            const response = await axios.post(
                'https://api.openai.com/v1/audio/transcriptions',
                form,
                {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            if(verbose) console.log('✅ Resposta recebida');
            resolve(response.data.text);
        });
    }
}
