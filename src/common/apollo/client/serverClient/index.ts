import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { genSchema } from "@/server/graphql/schema";
export const genServerClient = async () => {
	const schema = await genSchema({ checking: false });
	return new ApolloClient({
		ssrMode: true,
		// Instead of "createHttpLink" use SchemaLink here
		link: new SchemaLink({ schema }),
		cache: new InMemoryCache(),
		ssrForceFetchDelay: 1000,
	});
};
