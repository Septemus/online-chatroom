import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { genSchema } from "./schema";
import { jwt_prefix } from "@/common/jwt";
export type Context = {
	token: string;
};
export default async function myCreateGraphql() {
	const schema = await genSchema();
	const aServer = new ApolloServer({
		schema,
	});
	await aServer.start();
	return expressMiddleware(aServer, {
		context: async ({ req }) => ({
			token: req.headers.authorization?.replace(jwt_prefix, ""),
		}),
	});
}
