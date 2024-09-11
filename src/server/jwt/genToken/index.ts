import jwt from "jsonwebtoken";
export default function genToken(
	id: string,
	option: { expireIn: string },
): string {
	return jwt.sign(
		{
			id: id,
		},
		process.env.jwt_key as string,
		{
			algorithm: "HS256",
			expiresIn: option.expireIn,
		},
	);
}
