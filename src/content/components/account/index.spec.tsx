import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Account from ".";
import { setUpStore } from "@/content/store";
import { browserClient } from "@/common/apollo/client";
import { render, screen } from "@testing-library/react";
import events from "events";
import { Server } from "http";
import { AppDataSource, BookRepo, UserRepo } from "@/server/graphql/typeorm";
import myCreateGraphql from "@/server/graphql";
import express from "express";
import detect from "detect-port";
import cors from "cors";
import { randomUUID } from "crypto";
import { Users } from "@/server/graphql/entities/user";
import md5 from "md5";
import { setId } from "@/content/store/userSlice";
import { FOLLOW } from "@/common/apollo/client/queries/user/follow";
import { generateWholeApp } from "@/tests/utils/generateRenderObj";
import userEvent from "@testing-library/user-event";
const PORT = parseInt(process.env.PORT as string) || 3006;
const mylistener = new events();
const correct_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im11c2tldGVlcmR0QGdtYWlsLmNvbSIsImlhdCI6MTcyNTc5NTY1M30.KqJ9-x4TrVzu4hrEKBP2b6bNpA6uhK48G1VJ5D0eTXc";
let server: Server;
const TESTUSER_ARR = [
	{
		email: "musketeerdt@gmail.com",
		id: randomUUID(),
		password: "testpassword",
		name: "testuser-dy_9",
	},
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
const MAIN_CHARACTER = TESTUSER_ARR[0];
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
	localStorage.setItem("token", correct_token);
});
afterEach(async () => {
	// await BookRepo.clear();
	// await UserRepo.delete({});
	await browserClient.clearStore();
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
describe("Account", () => {
	jest.setTimeout(100000);
	function localGen() {
		const store = setUpStore();
		store.dispatch(setId(MAIN_CHARACTER.id));
		return (
			<Provider store={store}>
				<ApolloProvider client={browserClient}>
					<MemoryRouter initialEntries={["/"]}>
						<Routes>
							<Route
								element={<Account />}
								path="/"
							></Route>
						</Routes>
					</MemoryRouter>
				</ApolloProvider>
			</Provider>
		);
	}
	test("Without props it will show my Account Profile", async () => {
		render(localGen());
		await screen.findByText(MAIN_CHARACTER.name);
		await screen.findByText(MAIN_CHARACTER.email);
	});
	test("correctlly display number of followers and followings", async () => {
		await browserClient.mutate({
			mutation: FOLLOW,
			variables: {
				data: {
					followedId: MAIN_CHARACTER.email,
					followerId: TESTUSER_ARR[1].email,
				},
			},
		});
		await browserClient.mutate({
			mutation: FOLLOW,
			variables: {
				data: {
					followedId: MAIN_CHARACTER.email,
					followerId: TESTUSER_ARR[2].email,
				},
			},
		});
		await browserClient.mutate({
			mutation: FOLLOW,
			variables: {
				data: {
					followedId: TESTUSER_ARR[1].email,
					followerId: MAIN_CHARACTER.email,
				},
			},
		});
		render(localGen());
		await screen.findByText("2 followers");
		await screen.findByText("1 following");
	});
	test("account default show posts", async () => {
		render(
			generateWholeApp(undefined, {
				initialEntries: ["/account"],
				initialIndex: 0,
			}),
		);
		const postsEl = await screen.findByText("Posts", undefined, {
			timeout: 3000,
		});
		// eslint-disable-next-line testing-library/no-node-access
		expect(postsEl.parentElement?.classList).toContain(
			"ant-menu-item-selected",
		);
		await screen.findByText(MAIN_CHARACTER.name, undefined);
	});
	test("click Edit Profile button will redirect", async () => {
		render(
			generateWholeApp(undefined, {
				initialEntries: ["/account"],
				initialIndex: 0,
			}),
		);
		const edit_profile_bt = await screen.findByText(
			"Edit Profile",
			undefined,
			{
				timeout: 3000,
			},
		);
		userEvent.click(edit_profile_bt);
		await screen.findByText("Change photo");
	});
});
