export type Messages = {role: 'system' | 'user', content: string}[];

export default class Api {
	static async send(messages: Messages): Promise<Response>{
		const axios = require('axios');
		const apiKey = process.env.OPENAI_API_KEY;

		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{ "model": "gpt-3.5-turbo-0301", "messages": messages },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			}
		);

		return new Response(response.data.choices[0].message.content);
	}
}

export class Response {
	code: string[] = [];
	
	constructor(public text: string) {
		const self = this;
		
		(text.match(/```([^`]*)```/gmi) || []).forEach((text) => {
			self.code.push(text.substr(3, text.length - 6));
		});
	}
}
