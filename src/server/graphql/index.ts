import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { Server } from "http";
const books = [
	{
		title: "The Awakening",
		author: "Kate Chopin",
	},
	{
		title: "City of Glass",
		author: "Paul Auster",
	},
];
export default async function myCreateGraphql() {
	const aServer = new ApolloServer({
		typeDefs: `#graphql
            # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
        
            # This "Book" type defines the queryable fields for every book in our data source.
            type Book {
                title: String
                author: String
            }
        
            # The "Query" type is special: it lists all of the available queries that
            # clients can execute, along with the return type for each. In this
            # case, the "books" query returns an array of zero or more Books (defined above).
            type Query {
                books: [Book]
            }
        `,
		resolvers: {
			Query: {
				books: () => books,
			},
		},
	});
	await aServer.start();
	return expressMiddleware(aServer);
}
