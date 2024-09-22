import express from "express";
import cors from "cors";
import { render, screen, waitFor } from "@testing-library/react";
import myCreateGraphql from "@/server/graphql";
import { Server } from "http";
import events from "events";
import { AppDataSource, BookRepo, UserRepo } from "@/server/graphql/typeorm";
import detect from "detect-port";
import userEvent from "@testing-library/user-event";
import { generateWholeApp } from "@/tests/utils/generateRenderObj";
const PORT = parseInt(process.env.PORT as string) || 3006;
const mylistener = new events();
const correct_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im11c2tldGVlcmR0QGdtYWlsLmNvbSIsImlhdCI6MTcyNTc5NTY1M30.KqJ9-x4TrVzu4hrEKBP2b6bNpA6uhK48G1VJ5D0eTXc";
let server: Server;
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
	window.location.pathname = "/";
});
afterEach(async () => {
	await BookRepo.clear();
	// await UserRepo.clear();
	await UserRepo.delete({});
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
describe("App", () => {
	jest.setTimeout(100000);

	test("router guard-without token", async () => {
		render(generateWholeApp());
		await screen.findAllByText("Login");
	});
	test("router guard-with correct token", async () => {
		window.localStorage.setItem("token", correct_token);
		render(generateWholeApp());
		await screen.findByRole("menu");
	});
	test("logout", async () => {
		window.localStorage.setItem("token", correct_token);
		render(generateWholeApp());
		await screen.findByRole("menu");
		let item = screen.getByRole("menuitem", { name: "logout" });
		await userEvent.click(item);
		const confirm = await screen.findByText("Confirm");
		await userEvent.click(confirm);
		await screen.findAllByText("Login");
		expect(localStorage.getItem("token")).toBe(null);
	});
	test("router guard-with incorrect token", async () => {
		window.localStorage.setItem("token", "dwhweuje");
		render(generateWholeApp());
		await screen.findAllByText("Login");
	});
});
