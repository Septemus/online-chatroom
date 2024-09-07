import { ApolloClient, InMemoryCache } from "@apollo/client";
export const client = new ApolloClient({
	ssrMode: process.env.NODE_ENV !== "test",
	uri: "http://localhost:3006/graphql",
	cache: new InMemoryCache(),
});
