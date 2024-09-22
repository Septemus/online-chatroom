import { browserClient } from "@/common/apollo/client";
import routes from "@/common/routes";
import { RootState, setUpStore } from "@/content/store";
import { ApolloProvider } from "@apollo/client";
import { InitialEntry } from "@remix-run/router";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

function generateWholeApp(
	preloadedState?: RootState,
	routerOpts: {
		initialEntries?: InitialEntry[];
		initialIndex?: number;
	} = {
		initialEntries: ["/"],
		initialIndex: 0,
	},
) {
	const router = createMemoryRouter(routes, routerOpts);
	const renderObj = (
		<Provider store={setUpStore(preloadedState)}>
			<ApolloProvider client={browserClient}>
				<RouterProvider router={router}></RouterProvider>
			</ApolloProvider>
		</Provider>
	);
	return renderObj;
}
export { generateWholeApp };
