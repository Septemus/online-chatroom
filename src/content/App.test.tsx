import express from "express";
import cors from "cors";
import routes from "@/common/routes";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { setUpStore } from "./store";
import { browserClient } from "@/common/apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import myCreateGraphql from "@/server/graphql";
import { Server } from "http";
import events from "events";
import { AppDataSource, BookRepo, UserRepo } from "@/server/graphql/typeorm";
import detect from "detect-port";
const PORT = parseInt(process.env.PORT as string) || 3006;
const mylistener = new events();
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
describe("App", () => {
	jest.setTimeout(100000);
	function generateRenderObj() {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/"],
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
	test("router guard-without token", async () => {
		render(generateRenderObj());
		await waitFor(() => {
			return window.location.pathname === "/login";
		});
	});
	test("router guard-with correct token", async () => {
		window.localStorage.setItem(
			"token",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im11c2tldGVlcmR0QGdtYWlsLmNvbSIsImlhdCI6MTcyNTc5NTY1M30.KqJ9-x4TrVzu4hrEKBP2b6bNpA6uhK48G1VJ5D0eTXc",
		);
		render(generateRenderObj());
		await screen.findByRole("menu");
	});
	test("router guard-with incorrect token", async () => {
		window.localStorage.setItem("token", "dwhweuje");
		render(generateRenderObj());
		await waitFor(() => {
			return window.location.pathname === "/login";
		});
	});
});
