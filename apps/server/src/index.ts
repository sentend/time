import { server } from "./api";
import { client } from "./db";

const main = async () => {
	console.log("init main");

	try {
		const serverInstance = server();
		await client.connect();

		process.on("SIGINT", async () => {
			console.log("Gracefully shutting down");
			await client.end();

			serverInstance.close(() => {
				console.log("Server closed");
				process.exit(0);
			});
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

main();
