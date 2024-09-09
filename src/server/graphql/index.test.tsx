import express from "express";
import cors from "cors";
import myCreateGraphql from ".";
import axios from "axios";
import events from "events";
import { BookRepo, UserRepo } from "./typeorm";
import { client } from "@/common/apollo/client";
import { USERS } from "@/common/apollo/client/users";
import { USER } from "@/common/apollo/client/user";
import { Server } from "http";
import { DELETE } from "@/common/apollo/client/delete";
import { Users } from "./entities/user";
import { randomUUID } from "crypto";
import { LOGIN } from "@/common/apollo/client/login";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { VERIFY } from "@/common/apollo/verify";
const PORT = process.env.PORT || 3006;
const mylistener = new events();
let server: Server;
const TESTUSER = {
	email: "test@jest.com",
	id: randomUUID(),
	password: "testpassword",
	name: "testuser",
};
beforeAll(async () => {
	const midWare = await myCreateGraphql();
	const app = express();
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
afterAll(() => {
	server.close();
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
		const res = await client.query({
			query: LOGIN,
			variables: {
				data: {
					id: TESTUSER.id as string,
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
		let v_res = await client.query({
			query: VERIFY,
			variables: {
				token: res.data.login.token as string,
			},
			fetchPolicy: "no-cache",
		});
		expect(v_res.data.verify.success).toBe(true);
		expect(v_res.data.verify.id).toBe(TESTUSER.id);
		v_res = await client.query({
			query: VERIFY,
			variables: {
				token: randomUUID(),
			},
			fetchPolicy: "no-cache",
		});
		expect(v_res.data.verify.success).toBe(false);
	});
	test("users list Authentication", async () => {
		await new Promise((res) => {
			mylistener.addListener("server-ready", res);
			mylistener.emit("request");
		});
		let res = await client.query({
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
		let res = await client.query({
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
		let res = await client.mutate({
			mutation: DELETE,
			errorPolicy: "all",
			variables: {
				deleteUserId: TESTUSER.id,
			},
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
});
