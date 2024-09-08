import { AuthChecker } from "type-graphql";
import { Context } from "..";
import jwt from "jsonwebtoken";
import { OperationInfo } from "../entities/operationInfo";

export const customAuthChecker: AuthChecker<Context> = ({ context }, roles) => {
	console.log("checker", context);
	return checkLogic(context.token).success;
};
export function checkLogic(token: string): OperationInfo {
	let payload;
	try {
		payload = jwt.verify(token, process.env.jwt_key as string, {
			algorithms: ["HS256"],
		}) as jwt.JwtPayload;
		console.log("apollo auth checker:this is the payload:", payload);
	} catch (err) {
		return {
			success: false,
			msg: "verification failed!",
		};
	}
	return {
		success: true,
		msg: "token verification successful!",
		id: payload.id,
	};
}
