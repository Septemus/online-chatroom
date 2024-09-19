import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { REFRESH } from "./queries/refresh";
import { jwt_prefix } from "@/common/jwt";

async function refreshTokenRequestFunc(): Promise<void> {
	const response = await browserClient.query({
		query: REFRESH,
		variables: {
			oldToken: localStorage.getItem("token") ?? "",
		},
	});

	const { token } = response.data.refresh || {};
	if (token) localStorage.setItem("token", token);
}
const httpLink = createHttpLink({
	uri: `http://localhost:${process.env.PORT}/graphql`,
});
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	console.log("token has expired!Trying to refresh!");
	if (!graphQLErrors) return;
	for (const { path, extensions } of graphQLErrors) {
		if (extensions!.code !== "UNAUTHENTICATED" || !path) continue;

		const { getContext, setContext } = operation;
		const context = getContext();

		setContext({
			...context,
			headers: {
				...context?.headers,
				_needsRefresh: true,
			},
		});

		return forward(operation);
	}
});
const errorRefreshLink = setContext(async (_, previousContext) => {
	if (previousContext?.headers?._needsRefresh) {
		await refreshTokenRequestFunc();
	}
	return previousContext;
});
const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem("token") ?? "";
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `${jwt_prefix}${token}` : "",
		},
	};
});
export const browserClient = new ApolloClient({
	link: from([errorLink, errorRefreshLink, authLink, httpLink]),
	cache: new InMemoryCache(),
});
