import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const httpLink = createHttpLink({
	uri: "http://localhost:3006/graphql",
});
const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem("token");
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `${process.env.jwt_prefix}${token}` : "",
		},
	};
});
export const client = new ApolloClient({
	ssrMode: process.env.NODE_ENV !== "test",
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
