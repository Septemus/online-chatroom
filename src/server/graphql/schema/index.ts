import { buildSchema } from "type-graphql";
import { BookResolver } from "../resolvers/BookResolver";
import { UserResolver } from "../resolvers/UserResolver";
import { customAuthChecker } from "../checkers";
import { MessageResolver } from "../resolvers/MessageResolver";
import { pubSub } from "../pubsub";
export async function genSchema(
	arg: { checking: boolean } = { checking: true },
) {
	const { checking } = arg;
	const schema = await buildSchema({
		resolvers: [BookResolver, UserResolver, MessageResolver],
		pubSub,
		authChecker: checking ? customAuthChecker : () => true,
	});
	return schema;
}
