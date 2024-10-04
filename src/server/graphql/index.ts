import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { genSchema } from "./schema";
import { jwt_prefix } from "@/common/jwt";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

export type Context = {
	token: string;
};

export default async function myCreateGraphql(server: Server) {
	const schema = await genSchema();
	const wsServer = new WebSocketServer({
		server: server,
		path: "/subscriptions",
	});
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const serverCleanup = useServer({ schema }, wsServer);
	const aServer = new ApolloServer({
		schema,
		plugins: [
			// Proper shutdown for the HTTP server.
			ApolloServerPluginDrainHttpServer({ httpServer: server }),

			// Proper shutdown for the WebSocket server.
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
			process.env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageProductionDefault()
				: ApolloServerPluginLandingPageLocalDefault({
						footer: false,
						embed: {
							endpointIsEditable: true,
						},
					}),
		],
	});
	await aServer.start();
	return expressMiddleware(aServer, {
		context: async ({ req }) => ({
			token: req.headers.authorization?.replace(jwt_prefix, ""),
		}),
	});
}
