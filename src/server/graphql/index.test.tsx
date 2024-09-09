import express from "express";
import cors from "cors";
import myCreateGraphql from ".";
import axios from "axios";
import events from "events";
import { BookRepo } from "./typeorm";
import { client } from "@/common/apollo/client";
import { USERS } from "@/common/apollo/client/users";
import { USER } from "@/common/apollo/client/user";
import { Server } from "http";
const PORT = process.env.PORT || 3006;
const mylistener = new events();
let server: Server;
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
afterEach(async () => {
	await BookRepo.clear();
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
				userId: "",
			},
		});
		expect(res.data).toBe(null);
		expect(res.errors!["0"].extensions!.code).toBe("UNAUTHENTICATED");
	});
});
