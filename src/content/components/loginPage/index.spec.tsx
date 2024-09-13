import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import routes from "@/common/routes";
import userEvent from "@testing-library/user-event";
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import express from "express";
import { setUpStore } from "@/content/store";
import md5 from "md5";
import { ApolloProvider } from "@apollo/client";
import { browserClient } from "@/common/apollo/client";
import { AppDataSource, BookRepo, UserRepo } from "@/server/graphql/typeorm";
import myCreateGraphql from "@/server/graphql";
import detect from "detect-port";
import { Server } from "http";
import events from "events";
import cors from "cors";
import { Users } from "@/server/graphql/entities/user";
import { randomUUID } from "crypto";
const PORT = parseInt(process.env.PORT as string) || 3006;
let server: Server;
const mylistener = new events();
const TESTUSER = {
	email: "test@jest.com",
	id: randomUUID(),
	password: "testpassword",
	name: "testuser",
};
beforeAll(async () => {
	// listenerServer.listen();
	await AppDataSource.initialize();
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
	localStorage.clear();
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
	// listenerServer.close();
	server.close();
	AppDataSource.destroy();
	await new Promise((res) => {
		server.on("close", () => {
			res(null);
		});
	});
});
describe("loginPage", () => {
	jest.setTimeout(100000);
	function generateRenderObj() {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/login"],
			initialIndex: 0,
		});
		const renderObj = (
			<Provider store={setUpStore()}>
				<ApolloProvider client={browserClient}>
					<RouterProvider router={router}></RouterProvider>
				</ApolloProvider>
			</Provider>
		);
		return renderObj;
	}
	test("switch between login and register", async () => {
		render(generateRenderObj());
		let toggler = await screen.findByText("Sign Up");
		await userEvent.click(toggler);
		expect(screen.getByText("Register")).toBeTruthy();
		toggler = screen.getByText("Switch To Login");
		await userEvent.click(toggler);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Default display login form", async () => {
		render(generateRenderObj());
		expect(await screen.findByText("Login")).toBeTruthy();
	});
	test("Confirm Password", async () => {
		render(generateRenderObj());
		let toggler = await screen.findByText("Sign Up");
		await userEvent.click(toggler);
		let pwd: HTMLInputElement = screen.getByLabelText("Password");
		userEvent.click(pwd);
		userEvent.keyboard("password");
		expect(pwd.value).toBe("password");
		let confirm: HTMLInputElement =
			screen.getByLabelText("Confirm Password");
		userEvent.click(confirm);
		userEvent.keyboard("password1");
		expect(confirm.value).toBe("password1");
		const err_tip = await screen.findByText(
			"The new password that you entered do not match!",
		);
		expect(err_tip).toBeTruthy();
		userEvent.clear(confirm);
		userEvent.click(confirm);
		userEvent.keyboard("password");
		expect(confirm.value).toBe(pwd.value);
		await waitForElementToBeRemoved(() =>
			screen.queryByText(
				"The new password that you entered do not match!",
			),
		);
	});
	test("Email Check", async () => {
		const ERR_TIP_TEXT = "The input is not valid E-mail!";
		render(generateRenderObj());
		let toggler = await screen.findByText("Sign Up");
		userEvent.click(toggler);
		let email: HTMLInputElement = screen.getByLabelText("Email");
		async function emailAssert(content: string, res: boolean) {
			userEvent.click(email);
			userEvent.keyboard(content);
			expect(email.value).toBe(content);
			if (res) {
				expect(screen.queryByText(ERR_TIP_TEXT)).toBe(null);
			} else {
				const tmp = await screen.findByText(ERR_TIP_TEXT);
				expect(tmp).toBeTruthy();
			}
			userEvent.clear(email);
			if (screen.queryByText(ERR_TIP_TEXT)) {
				await waitForElementToBeRemoved(() =>
					screen.queryByText(ERR_TIP_TEXT),
				);
			}
		}
		await emailAssert("jingjiezhou", false);
		await emailAssert("@qq.com", false);
		await emailAssert("jingjie@qq.com@163.com", false);
		await emailAssert("1dfweg,hbjh@qq.com", false);
		await emailAssert("jing,jie@qq.com", false);
		await emailAssert("jingjie@q,q.com", false);
		await emailAssert("jingjie@qq.com", true);
		await screen.findByText("Please input your Username!");
	});
	test("Username Length Check", async () => {
		const ERR_TIP_TEXT = "Username length must be between 4 and 18!";
		render(generateRenderObj());
		let toggler = await screen.findByText("Sign Up");
		userEvent.click(toggler);
		let username: HTMLInputElement = screen.getByLabelText("Username");
		async function userNameAssert(content: string, res: boolean) {
			userEvent.click(username);
			userEvent.keyboard(content);
			expect(username.value).toBe(content);
			if (res) {
				expect(screen.queryByText(ERR_TIP_TEXT)).toBe(null);
			} else {
				const tmp = await screen.findByText(ERR_TIP_TEXT);
				expect(tmp).toBeTruthy();
			}
			userEvent.clear(username);
			if (screen.queryByText(ERR_TIP_TEXT)) {
				await waitForElementToBeRemoved(() =>
					screen.queryByText(ERR_TIP_TEXT),
				);
			}
		}
		await userNameAssert("abc", false);
		await userNameAssert("abcabcabcabcabcabcabc", false);
		await userNameAssert("abcabcabc", true);
		await screen.findByText("Please input your Username!");
	});
	test("Login success will save token in storage", async () => {
		render(generateRenderObj());
		let email: HTMLInputElement =
			await screen.findByLabelText("User ID/Email");
		let pwd: HTMLInputElement = screen.getByLabelText("Password");
		let submit: HTMLButtonElement = screen.getByText("Login");
		userEvent.click(email);
		userEvent.keyboard(TESTUSER.email);
		userEvent.click(pwd);
		userEvent.keyboard(TESTUSER.password);
		userEvent.click(submit);
		await waitFor(() => {
			expect(localStorage.getItem("token")).toBeTruthy();
		});
	});
	test("router guard with correct token:Jump to App", async () => {
		localStorage.setItem(
			"token",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmYWQzM2YyLWU1NTAtNDNlZS05OGM2LTIxNDcyMzIxODYxNSIsImlhdCI6MTcyNjA1MjU4MSwiZXhwIjoxODgxNTcyNTgxfQ.uCzYbygTW3CjaTU45pU1NugKm3BVKXVEjl8SqAlHyhA",
		);
		render(generateRenderObj());
		await waitFor(() => {
			expect(window.location.pathname).toBe("/");
		});
	});
});
