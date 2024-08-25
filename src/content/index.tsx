import React from "react";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "@/content/reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/common/routes";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
let router = createBrowserRouter(routes);
const client = new ApolloClient({
	ssrMode: true,
	uri: "http://localhost:3006/graphql",
	cache: new InMemoryCache(),
});
hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<React.StrictMode>
		<ApolloProvider client={client}>
			<RouterProvider router={router} />
		</ApolloProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
