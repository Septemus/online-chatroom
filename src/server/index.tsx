import cors from "cors";
import express from "express";
import myCreateSocket from "./socket";
import myCreateGraphql from "./graphql";
import SSRCallback from "./ssr";
import dotenv from "dotenv";
Object.assign(global, { WebSocket: require("ws") });
dotenv.config();
async function setUpExpressServer() {
	const PORT = process.env.PORT || 3006;
	const app = express();
	const server = app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json(),
		await myCreateGraphql(),
	);

	app.use(express.static("./build", { index: false }));

	app.get("*", SSRCallback);

	myCreateSocket(server);
}
setUpExpressServer();
