import cors from "cors";
import express from "express";
import myCreateSocket from "./socket";
import myCreateGraphql from "./graphql";
import SSRCallback from "./ssr";
import dotenv from "dotenv";
import { AppDataSource } from "./graphql/typeorm";
Object.assign(global, { WebSocket: require("ws") });
dotenv.config();
async function setUpExpressServer() {
	await AppDataSource.initialize();
	const PORT = process.env.PORT || 3006;
	const app = express();
	const server = app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json({ limit: "10mb" }),
		await myCreateGraphql(),
	);

	app.use(express.static("./build", { index: false }));

	app.get("*", SSRCallback);

	myCreateSocket(server);
}
setUpExpressServer();
