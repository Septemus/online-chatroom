import React from "react";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "@/content/reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/common/routes";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { store } from "@/content/store";
import { Provider } from "react-redux";
import { client } from "@/common/apollo/client";
let router = createBrowserRouter(routes);

hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<React.StrictMode>
		<Provider store={store}>
			<ApolloProvider client={client}>
				<RouterProvider router={router} />
			</ApolloProvider>
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
