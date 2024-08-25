import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";
import { UserResolver } from "./resolvers/UserResolver";
export default async function myCreateGraphql() {
	const schema = await buildSchema({
		resolvers: [BookResolver, UserResolver],
	});
	const aServer = new ApolloServer({
		schema,
	});
	await aServer.start();
	return expressMiddleware(aServer);
}
