import express from "express";
import cors from "cors";
import myCreateGraphql from ".";
import axios from "axios";
import events from "events";
import { BookRepo } from "./typeorm";
const PORT = process.env.PORT || 3006;
const mylistener = new events();
beforeAll(async () => {
	const midWare = await myCreateGraphql();
	const app = express();
	app.listen(PORT, () => {
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
describe("graphql-middleWare", () => {
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
