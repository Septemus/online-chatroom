import express from "express";
import cors from "cors";
import myCreateGraphql from ".";
import axios from "axios";
import events from "events";
import { BookRepo, UserRepo } from "./typeorm";
import { browserClient } from "@/common/apollo/client";
import { USERS } from "@/common/apollo/client/queries/users";
import { USER } from "@/common/apollo/client/queries/user";
import { Server } from "http";
import { DELETE } from "@/common/apollo/client/queries/delete";
import { Users } from "./entities/user";
import { randomUUID } from "crypto";
import { LOGIN } from "@/common/apollo/client/queries/login";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { REGISTER } from "@/common/apollo/client/queries/register";
import { AppDataSource } from "./typeorm";
import detect from "detect-port";
import { jwt_key } from "@/common/jwt";
import { FOLLOW } from "@/common/apollo/client/queries/user/follow";
const correct_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im11c2tldGVlcmR0QGdtYWlsLmNvbSIsImlhdCI6MTcyNTc5NTY1M30.KqJ9-x4TrVzu4hrEKBP2b6bNpA6uhK48G1VJ5D0eTXc";
const PORT = parseInt(process.env.PORT as string) || 3006;
const mylistener = new events();
let server: Server;
const TESTUSER_ARR = [
	{
		email: "test@jest.com",
		id: randomUUID(),
		password: "testpassword",
		name: "testuser",
	},
	{
		email: "abc@jest.com",
		id: randomUUID(),
		password: "testpassword2",
		name: "testuser2",
	},
];
const TESTUSER = TESTUSER_ARR[0];
beforeAll(async () => {
	AppDataSource.initialize();
	const midWare = await myCreateGraphql();
	const app = express();
	await new Promise((res) => {
		const itv = setInterval(async () => {
			const status = (await detect(PORT)) === PORT;
			if (status) {
				res(null);
				clearInterval(itv);
			}
		}, 2000);
	});
	server = app.listen(PORT, () => {
		setTimeout(() => {
			mylistener.emit("server-ready");
		}, 1000);
		mylistener.on("request", () => {
			setTimeout(() => {
				mylistener.emit("server-ready");
			}, 1000);
		});
	});
	app.use("/graphql", cors<cors.CorsRequest>(), express.json(), midWare);
});
beforeEach(async () => {
	await BookRepo.clear();
	// await UserRepo.clear();
	await UserRepo.delete({});
	await new Promise((res) => {
		mylistener.addListener("server-ready", res);
		mylistener.emit("request");
	});
	for (const USER of TESTUSER_ARR) {
		const u = new Users();
		Object.assign(u, USER);
		u.password = md5(u.password);
		await UserRepo.save(u);
	}
});
afterEach(async () => {});
afterAll(async () => {
	server.close();
	AppDataSource.destroy();
	await new Promise((res) => {
		server.on("close", () => {
			res(null);
		});
	});
});
describe("graphql-middleWare-demo", () => {
	jest.setTimeout(100000);

	test("init", async () => {
		expect(process.env.db_name).toBe("chatroom_test");
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		const res = await axios.post(`http://localhost:${PORT}/graphql`, {
			query: "query booksQuery {\n  books {\n    author\n    title\n  }\n}\n",
			variables: {},
			operationName: "booksQuery",
		});
		expect(res.data).toEqual({
			data: {
				books: [],
			},
		});
	});
	test("add", async () => {
		expect(process.env.db_name).toBe("chatroom_test");
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		const res = await axios.post(`http://localhost:${PORT}/graphql`, {
			query: "mutation addBookMuttation($data: CreateBookInput!) {\n  createBook(data: $data) {\n    author\n        title\n  }\n}",
			variables: { data: { author: "作者", title: "书名" } },
			operationName: "addBookMuttation",
		});
		expect(res.data).toEqual({
			data: { createBook: { author: "作者", title: "书名" } },
		});
	});
});

describe("user", () => {
	test("login+JWT verification", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		const res = await browserClient.query({
			query: LOGIN,
			variables: {
				data: {
					id: TESTUSER.email as string,
					password: md5(TESTUSER.password as string),
				},
			},
			fetchPolicy: "no-cache",
		});
		expect(res.data.login.success).toBe(true);
		const payload = jwt.verify(res.data.login.token as string, jwt_key, {
			algorithms: ["HS256"],
		}) as jwt.JwtPayload;
		expect(payload.id).toBe(TESTUSER.id);
	});
	test("register", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		const newUser = {
			email: "musketeerdt@gmail.com",
			name: "kane",
			password: "theeverchosen19",
		};
		let reg_res = await browserClient.mutate({
			mutation: REGISTER,
			errorPolicy: "all",
			variables: {
				data: { ...newUser, password: md5(newUser.password) },
			},
		});
		expect(reg_res.data?.createUser.success).toBe(true);
		const login_res = await browserClient.query({
			query: LOGIN,
			variables: {
				data: {
					id: newUser.email as string,
					password: md5(newUser.password as string),
				},
			},
			fetchPolicy: "no-cache",
		});
		expect(login_res.data.login.success).toBe(true);
	});
	test("users list Authentication", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let res = await browserClient.query({
			query: USERS,
			errorPolicy: "all",
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
	test("user Authentication", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let res = await browserClient.query({
			query: USER,
			errorPolicy: "all",
			variables: {
				userId: TESTUSER.id,
			},
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
	test("delete Authentication", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let res = await browserClient.mutate({
			mutation: DELETE,
			errorPolicy: "all",
			variables: {
				deleteUserId: TESTUSER.id,
			},
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
	test("email is unique", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let reg_res = await browserClient.mutate({
			mutation: REGISTER,
			errorPolicy: "all",
			variables: {
				data: {
					name: "uniquetest",
					email: TESTUSER.email,
					password: "not important",
				},
			},
		});
		expect(reg_res.data?.createUser.success).toBe(false);
		expect(
			await UserRepo.count({
				where: {
					email: TESTUSER.email,
				},
			}),
		).toBe(1);
	});
	test("username length restriction", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		await browserClient.mutate({
			mutation: REGISTER,
			errorPolicy: "all",
			variables: {
				data: {
					name: "abc",
					email: TESTUSER.email,
					password: "not important",
				},
			},
		});
		expect(
			await UserRepo.count({
				where: {
					name: "abc",
				},
			}),
		).toBe(0);
		await browserClient.mutate({
			mutation: REGISTER,
			errorPolicy: "all",
			variables: {
				data: {
					name: "abcabcabcabcabcabcabc",
					email: TESTUSER.email,
					password: "not important",
				},
			},
		});
		expect(
			await UserRepo.count({
				where: {
					name: "abcabcabc",
				},
			}),
		).toBe(0);
	});
	test("follow Authentication", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let res = await browserClient.mutate({
			mutation: FOLLOW,
			errorPolicy: "all",
			variables: {
				data: {
					followedId: TESTUSER_ARR[0].email,
					followerId: TESTUSER_ARR[1].email,
				},
			},
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
	test("follow api", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		localStorage.setItem("token", correct_token);
		await browserClient.mutate({
			mutation: FOLLOW,
			errorPolicy: "all",
			variables: {
				data: {
					followedId: TESTUSER_ARR[0].email,
					followerId: TESTUSER_ARR[1].email,
				},
			},
		});
		const res = await Promise.all(
			[TESTUSER_ARR[0], TESTUSER_ARR[1]].map((TARGET) => {
				return browserClient.query({
					query: USER,
					variables: {
						userId: TARGET.id,
					},
				});
			}),
		);
		console.log(res[0].data.user.followers, res[1].data.user.following);
		expect(res[0].data.user.followers[0].id).toBe(TESTUSER_ARR[1].id);
		expect(res[1].data.user.following[0].id).toBe(TESTUSER_ARR[0].id);
	});
});
