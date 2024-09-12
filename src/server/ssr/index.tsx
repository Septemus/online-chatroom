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
import { client } from "@/common/apollo/client";
import React from "react";
import routes from "@/common/routes";
import { ApolloProvider } from "@apollo/client";
import { store } from "@/content/store";
import { Provider } from "react-redux";
import { renderToStringWithData } from "@apollo/client/react/ssr";
// import type Entity from "@ant-design/cssinjs/es/Cache";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

let handler = createStaticHandler(routes);

const SSRCallback: RequestHandler = async (req, res) => {
	const cache = createCache();
	let fetchRequest = createFetchRequest(req, res);
	let context: StaticHandlerContext = (await handler.query(
		fetchRequest,
	)) as StaticHandlerContext;
	let router = createStaticRouter(handler.dataRoutes, context);
	const app = await renderToStringWithData(
		<React.StrictMode>
			<StyleProvider cache={cache}>
				<Provider store={store}>
					<ApolloProvider client={client}>
						<StaticRouterProvider
							router={router}
							context={context}
						/>
					</ApolloProvider>
				</Provider>
			</StyleProvider>
		</React.StrictMode>,
	);
	const styleText = extractStyle(cache);
	const indexFile = path.resolve("./build/index.html");

	fs.readFile(indexFile, "utf8", (err, data) => {
		if (err) {
			console.error("Something went wrong:", err);
			return res.status(500).send("Oops, better luck next time!");
		}
		data = data.replace(
			'<div id="root"></div>',
			`<div id="root">${app}</div>`,
		);
		data =
			data.slice(0, data.indexOf("</head>")) +
			styleText +
			"</head>" +
			data.slice(data.indexOf("<body>"));
		return res.send(data);
	});
};
export default SSRCallback;
