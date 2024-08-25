import path from "path";
import fs from "fs";
import type { RequestHandler } from "express-serve-static-core";
import createFetchRequest from "../router/createFetchRequest";
import {
	createStaticHandler,
	createStaticRouter,
	StaticHandlerContext,
	StaticRouterProvider,
} from "react-router-dom/server";
import ReactDOMServer from "react-dom/server";
import React from "react";
import routes from "@/common/routes";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { store } from "@/content/store";
import { Provider } from "react-redux";

let handler = createStaticHandler(routes);

const SSRCallback: RequestHandler = async (req, res) => {
	const client = new ApolloClient({
		ssrMode: true,
		uri: "http://localhost:3006/graphql",
		cache: new InMemoryCache(),
	});

	let fetchRequest = createFetchRequest(req, res);
	let context: StaticHandlerContext = (await handler.query(
		fetchRequest,
	)) as StaticHandlerContext;
	let router = createStaticRouter(handler.dataRoutes, context);
	const app = ReactDOMServer.renderToString(
		<React.StrictMode>
			<Provider store={store}>
				<ApolloProvider client={client}>
					<StaticRouterProvider
						router={router}
						context={context}
					/>
				</ApolloProvider>
			</Provider>
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
};
export default SSRCallback;
