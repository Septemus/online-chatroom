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
import { genServerClient } from "@/common/apollo/client/serverClient";
import React from "react";
import routes from "@/common/routes";
import { ApolloProvider } from "@apollo/client";
import { setUpStore } from "@/content/store";
import { Provider } from "react-redux";
import { renderToStringWithData } from "@apollo/client/react/ssr";
// import type Entity from "@ant-design/cssinjs/es/Cache";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

let handler = createStaticHandler(routes);

const SSRCallback: RequestHandler = async (req, res) => {
	const serverClient = await genServerClient();
	const cache = createCache();
	let fetchRequest = createFetchRequest(req, res);
	let context: StaticHandlerContext = (await handler.query(
		fetchRequest,
	)) as StaticHandlerContext;
	let router = createStaticRouter(handler.dataRoutes, context);
	const renderOBJ = (
		<React.StrictMode>
			<ApolloProvider client={serverClient}>
				<StyleProvider cache={cache}>
					<Provider store={setUpStore()}>
						<StaticRouterProvider
							router={router}
							context={context}
						/>
					</Provider>
				</StyleProvider>
			</ApolloProvider>
		</React.StrictMode>
	);
	const app = await renderToStringWithData(renderOBJ);
	const styleText = extractStyle(cache);
	const indexFile = path.resolve("./build/index.html");
	fs.readFile(indexFile, "utf8", (err, data) => {
		if (err) {
			console.error("Something went wrong:", err);
			return res.status(500).send("Oops, better luck next time!");
		}
		data = data.replace(
			'<div id="root"></div>',
			`<div id="root">${app}</div><script>window.__APOLLO_STATE__=${JSON.stringify(serverClient.extract()).replace(/</g, "\\u003c")};</script>`,
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
