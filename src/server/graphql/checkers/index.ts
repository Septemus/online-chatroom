import { AuthChecker, AuthenticationError } from "type-graphql";
import { Context } from "..";
import jwt from "jsonwebtoken";
import { OperationInfo } from "../entities/operationInfo";

export const customAuthChecker: AuthChecker<Context> = ({ context }, roles) => {
	console.log(
		"checker for App actions:must bring along correcr token",
		context,
	);
	try {
		return checkLogic(context.token).success;
	} catch (err) {
		throw new AuthenticationError((err as jwt.VerifyErrors).message);
	}
};
export function checkLogic(token: string): OperationInfo {
	let payload = jwt.verify(token, process.env.jwt_key as string, {
		algorithms: ["HS256"],
	}) as jwt.JwtPayload;
	return {
		success: true,
		msg: "token verification successful!",
		id: payload.id,
	};
}
