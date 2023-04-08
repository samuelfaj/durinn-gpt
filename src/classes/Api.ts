export type Messages = {role: 'system' | 'user', content: string}[];

export default class Api {
	context: Messages = [];

	async addContext(context: Messages){
		this.context = this.context.concat(context);
		return this;
	}

	async send(messages: Messages): Promise<Response>{
		const self = this;
		const axios = require('axios');
		const apiKey = process.env.OPENAI_API_KEY;

		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{ "model": "gpt-3.5-turbo-0301", "messages": self.context.concat(messages) },
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
		
		(text.match(/```(.*)```/gis) || []).forEach((text) => {
			self.code.push(text.substr(3, text.length - 6));
		});
	}
}
