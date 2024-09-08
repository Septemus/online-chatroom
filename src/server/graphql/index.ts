import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { customAuthChecker } from "./checkers";
export type Context = {
	token: string;
};
export default async function myCreateGraphql() {
	const schema = await buildSchema({
		resolvers: [BookResolver, UserResolver],
		authChecker: customAuthChecker,
	});
	const aServer = new ApolloServer({
		schema,
	});
	await aServer.start();
	return expressMiddleware(aServer, {
		context: async ({ req }) => ({
			token: req.headers.authorization?.replace(
				process.env.jwt_prefix as string,
				"",
			),
		}),
	});
}
