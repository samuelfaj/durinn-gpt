import Intelligence from "./classes/Intelligence";

async function playground() {
	console.log(await Intelligence.getTsConfig());
}

playground();
