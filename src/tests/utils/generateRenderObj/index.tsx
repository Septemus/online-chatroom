import { browserClient } from "@/common/apollo/client";
import routes from "@/common/routes";
import { setUpStore } from "@/content/store";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function generateWholeApp() {
	const router = createBrowserRouter(routes);
	browserClient.clearStore();
	const renderObj = (
		<Provider store={setUpStore()}>
			<ApolloProvider client={browserClient}>
				<RouterProvider router={router}></RouterProvider>
			</ApolloProvider>
		</Provider>
	);
	return renderObj;
}
export { generateWholeApp };
