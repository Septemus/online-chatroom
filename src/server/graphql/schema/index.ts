import { buildSchema } from "type-graphql";
import { BookResolver } from "../resolvers/BookResolver";
import { UserResolver } from "../resolvers/UserResolver";
import { customAuthChecker } from "../checkers";

export async function genSchema(
	arg: { checking: boolean } = { checking: true },
) {
	const { checking } = arg;
	const schema = await buildSchema({
		resolvers: [BookResolver, UserResolver],
		authChecker: checking ? customAuthChecker : () => true,
	});
	return schema;
}
