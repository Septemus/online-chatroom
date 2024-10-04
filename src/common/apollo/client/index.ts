import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
	split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { REFRESH } from "./queries/user/refresh";
import { jwt_prefix } from "@/common/jwt";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

const wsLink =
	typeof window !== "undefined"
		? new GraphQLWsLink(
				createClient({
					url: `ws://localhost:${process.env.PORT}/subscriptions`,
				}),
			)
		: null;

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (!graphQLErrors) return;
	for (const { path, extensions } of graphQLErrors) {
		if (extensions!.code !== "UNAUTHENTICATED" || !path) continue;
		console.log("token has expired!Trying to refresh!");
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
const link =
	typeof window !== "undefined" && wsLink != null
		? split(
				({ query }) => {
					const def = getMainDefinition(query);
					return (
						def.kind === "OperationDefinition" &&
						def.operation === "subscription"
					);
				},
				wsLink,
				httpLink,
			)
		: httpLink;
export const browserClient = new ApolloClient({
	link: from([errorLink, errorRefreshLink, authLink, link]),
	cache: new InMemoryCache(),
});
