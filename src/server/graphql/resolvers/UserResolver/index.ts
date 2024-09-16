import jwt from "jsonwebtoken";
import {
	Resolver,
	Query,
	Mutation,
	Arg,
	Authorized,
	AuthenticationError,
} from "type-graphql";
import {
	CreateUserInput,
	followInput,
	loginInput,
	Users,
} from "@/server/graphql/entities/user";
import { UserRepo } from "@/server/graphql/typeorm";
import { OperationInfo } from "@/server/graphql/entities/operationInfo";
import { randomUUID } from "crypto";
import { checkLogic } from "@/server/graphql/checkers";
import genToken from "@/server/jwt/genToken";
import { validate } from "class-validator";
@Resolver()
export class UserResolver {
	@Authorized()
	@Query(() => [Users])
	async users(): Promise<Users[]> {
		const ret = await UserRepo.find({
			relations: {
				followers: true,
				following: true,
			},
		});
		return ret;
	}

	@Authorized()
	@Query(() => Users)
	async user(@Arg("id") id: string): Promise<Users | null> {
		const ret = await UserRepo.findOne({
			where: [{ id }, { email: id }],
			relations: {
				followers: true,
				following: true,
			},
		});
		return ret;
	}

	@Query(() => OperationInfo)
	async login(@Arg("data") data: loginInput): Promise<OperationInfo> {
		const user = await UserRepo.findOne({
			where: [{ ...data }, { email: data.id, password: data.password }],
		});
		if (!user) {
			return {
				success: false,
				msg: "用户不存在！",
			};
		} else {
			return {
				success: true,
				msg: "登录成功",
				token: genToken(user.id, { expireIn: "3d" }),
			};
		}
	}

	@Query(() => OperationInfo)
	verify(@Arg("token") token: string): OperationInfo {
		console.log("verifying");
		try {
			return checkLogic(token);
		} catch (err) {
			throw new AuthenticationError((err as jwt.VerifyErrors).message);
		}
	}

	@Query(() => OperationInfo)
	refresh(@Arg("oldToken") oldToken: string): OperationInfo {
		try {
			checkLogic(oldToken);
			return {
				msg: "Refreshed",
				success: true,
				token: genToken((jwt.decode(oldToken) as jwt.JwtPayload).id, {
					expireIn: "3d",
				}),
			};
		} catch (err) {
			if ((err as jwt.VerifyErrors).name === "TokenExpiredError") {
				return {
					msg: "Refreshed",
					success: true,
					token: genToken(
						(jwt.decode(oldToken) as jwt.JwtPayload).id,
						{
							expireIn: "3d",
						},
					),
				};
			} else {
				return {
					msg: "refresh failed",
					success: false,
				};
			}
		}
	}

	@Mutation(() => OperationInfo)
	async createUser(
		@Arg("data") data: CreateUserInput,
	): Promise<OperationInfo> {
		const u = new Users();
		Object.assign(u, data, { id: randomUUID() });
		const ret: OperationInfo = {
			success: true,
			msg: "register successful!",
		};
		const errors = await validate(u);
		if (errors.length) {
			throw errors;
		}
		try {
			console.log("saving");
			await UserRepo.save(u);
		} catch (err: any) {
			console.log("something wrong!", err.detail);
			ret.success = false;
			ret.msg = err.detail;
		}
		return ret;
	}

	@Authorized()
	@Mutation(() => OperationInfo)
	async deleteUser(@Arg("id") id: string): Promise<OperationInfo> {
		const user = await UserRepo.findOne({ where: [{ id }, { email: id }] });
		if (!user) {
			return {
				success: false,
				msg: "用户不存在！",
			};
		}
		await UserRepo.remove(user);
		return {
			success: true,
			msg: "删除成功！",
		};
	}

	@Authorized()
	@Mutation(() => OperationInfo)
	async addFollowing(@Arg("data") data: followInput): Promise<OperationInfo> {
		const followed = (await UserRepo.findOne({
			where: [{ id: data.followedId }, { email: data.followedId }],
			relations: {
				followers: true,
				following: true,
			},
		})) as Users;
		const follower = (await UserRepo.findOne({
			where: [{ id: data.followerId }, { email: data.followerId }],
			relations: {
				followers: true,
				following: true,
			},
		})) as Users;
		followed?.followers.push(follower);
		follower.following.push(followed);
		UserRepo.save(followed);
		UserRepo.save(follower);
		return {
			msg: "添加成功！",
			success: true,
		};
	}
}
