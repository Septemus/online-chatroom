import { jwt_algorithm, jwt_key } from "@/common/jwt";
import jwt from "jsonwebtoken";
export default function genToken(
	id: string,
	option: { expireIn: string },
): string {
	return jwt.sign(
		{
			id: id,
		},
		jwt_key,
		{
			algorithm: jwt_algorithm,
			expiresIn: option.expireIn,
		},
	);
}
