import path from "path";
import fs from "fs";
import cors from "cors";
import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
import myCreateSocket from "./socket";
import {
	createStaticHandler,
	createStaticRouter,
	StaticHandlerContext,
	StaticRouterProvider,
} from "react-router-dom/server";
import createFetchRequest from "./router/createFetchRequest";
import routes from "@/common/routes";
import myCreateGraphql from "./graphql";

Object.assign(global, { WebSocket: require("ws") });
async function setUpExpressServer() {
	const PORT = process.env.PORT || 3006;
	const app = express();
	const server = app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
	let handler = createStaticHandler(routes);

	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json(),
		await myCreateGraphql(),
	);

	app.use(express.static("./build", { index: false }));

	app.get("*", async (req, res) => {
		let fetchRequest = createFetchRequest(req, res);
		let context: StaticHandlerContext = (await handler.query(
			fetchRequest,
		)) as StaticHandlerContext;
		let router = createStaticRouter(handler.dataRoutes, context);
		const app = ReactDOMServer.renderToString(
			<React.StrictMode>
				<StaticRouterProvider
					router={router}
					context={context}
				/>
			</React.StrictMode>,
		);
		const indexFile = path.resolve("./build/index.html");

		fs.readFile(indexFile, "utf8", (err, data) => {
			if (err) {
				console.error("Something went wrong:", err);
				return res.status(500).send("Oops, better luck next time!");
			}

			return res.send(
				data.replace(
					'<div id="root"></div>',
					`<div id="root">${app}</div>`,
				),
			);
		});
	});

	myCreateSocket(server);
}
setUpExpressServer();
