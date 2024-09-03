import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
	CreateUserInput,
	loginInput,
	User,
} from "@/server/graphql/entities/user";
import { UserRepo } from "@/server/graphql/typeorm";
import { OperationInfo } from "../../entities/operationInfo";
import { randomUUID } from "crypto";
@Resolver()
export class UserResolver {
	@Query(() => [User])
	users(): Promise<User[]> {
		return UserRepo.find();
	}

	@Query(() => User)
	user(@Arg("id") id: string): Promise<User | null> {
		return UserRepo.findOne({ where: { id } });
	}

	@Query(() => OperationInfo)
	async login(@Arg("data") data: loginInput): Promise<OperationInfo> {
		const user = await UserRepo.findOne({ where: { ...data } });
		if (!user) {
			return {
				success: false,
				msg: "用户不存在！",
			};
		} else {
			return {
				success: true,
				msg: "登录成功",
			};
		}
	}

	@Mutation(() => User)
	async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
		const u = new User();
		Object.assign(u, data, { id: randomUUID() });
		await UserRepo.save(u);
		return u;
	}

	@Mutation(() => OperationInfo)
	async deleteUser(@Arg("id") id: string): Promise<OperationInfo> {
		const user = await UserRepo.findOne({ where: { id } });
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
