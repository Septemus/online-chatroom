import React from "react";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "@/content/reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/common/routes";
import { ApolloProvider } from "@apollo/client";
import { store } from "@/content/store";
import { Provider } from "react-redux";
import { browserClient } from "@/common/apollo/client";
let router = createBrowserRouter(routes);
console.log(
	"hydrating apollo state in browser!",
	(window as any).__APOLLO_STATE__,
);
browserClient.restore((window as any).__APOLLO_STATE__);
hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<React.StrictMode>
		<Provider store={store}>
			<ApolloProvider client={browserClient}>
				<RouterProvider router={router} />
			</ApolloProvider>
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
