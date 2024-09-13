import express from "express";
import cors from "cors";
import myCreateGraphql from ".";
import axios from "axios";
import events from "events";
import { BookRepo, UserRepo } from "./typeorm";
import { browserClient } from "@/common/apollo/client";
import { USERS } from "@/common/apollo/client/users";
import { USER } from "@/common/apollo/client/user";
import { Server } from "http";
import { DELETE } from "@/common/apollo/client/delete";
import { Users } from "./entities/user";
import { randomUUID } from "crypto";
import { LOGIN } from "@/common/apollo/client/login";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { REGISTER } from "@/common/apollo/client/register";
import { AppDataSource } from "./typeorm";
import detect from "detect-port";
const PORT = parseInt(process.env.PORT as string) || 3006;
const mylistener = new events();
let server: Server;
const TESTUSER = {
	email: "test@jest.com",
	id: randomUUID(),
	password: "testpassword",
	name: "testuser",
};
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
	await new Promise((res) => {
		mylistener.addListener("server-ready", res);
		mylistener.emit("request");
	});
	const u = new Users();
	Object.assign(u, TESTUSER);
	u.password = md5(u.password);
	await UserRepo.save(u);
});
afterEach(async () => {
	await BookRepo.clear();
	await UserRepo.clear();
});
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
		const payload = jwt.verify(
			res.data.login.token as string,
			process.env.jwt_key as string,
			{
				algorithms: ["HS256"],
			},
		) as jwt.JwtPayload;
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
});
