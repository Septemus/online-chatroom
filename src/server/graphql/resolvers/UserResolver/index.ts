import jwt from "jsonwebtoken";
import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import {
	CreateUserInput,
	loginInput,
	Users,
} from "@/server/graphql/entities/user";
import { UserRepo } from "@/server/graphql/typeorm";
import { OperationInfo } from "@/server/graphql/entities/operationInfo";
import { randomUUID } from "crypto";
import { checkLogic } from "@/server/graphql/checkers";
@Resolver()
export class UserResolver {
	@Authorized()
	@Query(() => [Users])
	users(): Promise<Users[]> {
		console.log("users");
		return UserRepo.find();
	}

	@Authorized()
	@Query(() => Users)
	user(@Arg("id") id: string): Promise<Users | null> {
		return UserRepo.findOne({ where: [{ id }, { email: id }] });
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
				token: jwt.sign(
					{
						id: user.id,
					},
					process.env.jwt_key as string,
					{
						algorithm: "HS256",
						expiresIn: "30d",
					},
				),
			};
		}
	}

	@Query(() => OperationInfo)
	verify(@Arg("token") token: string): OperationInfo {
		return checkLogic(token);
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
}
