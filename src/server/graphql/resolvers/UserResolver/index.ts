import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
	CreateUserInput,
	loginInput,
	Users,
} from "@/server/graphql/entities/user";
import { UserRepo } from "@/server/graphql/typeorm";
import { OperationInfo } from "../../entities/operationInfo";
import { randomUUID } from "crypto";
@Resolver()
export class UserResolver {
	@Query(() => [Users])
	users(): Promise<Users[]> {
		return UserRepo.find();
	}

	@Query(() => Users)
	user(@Arg("id") id: string): Promise<Users | null> {
		return UserRepo.findOne({ where: [{ id }, { email: id }] });
	}

	@Query(() => OperationInfo)
	async login(@Arg("data") data: loginInput): Promise<OperationInfo> {
		const user = await UserRepo.findOne({
			where: [{ ...data }, { email: data.id, password: data.id }],
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
			};
		}
	}

	@Mutation(() => OperationInfo)
	async createUser(
		@Arg("data") data: CreateUserInput,
	): Promise<OperationInfo> {
		const u = new Users();
		Object.assign(u, data, { id: randomUUID() });
		await UserRepo.save(u);
		return {
			success: true,
			msg: "注册成功",
		};
	}

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
