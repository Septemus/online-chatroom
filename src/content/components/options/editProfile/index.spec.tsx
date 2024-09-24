import express from "express";
import { Server } from "http";
import detect from "detect-port";
import myCreateGraphql from "@/server/graphql";
import { AppDataSource, BookRepo, UserRepo } from "@/server/graphql/typeorm";
import { generateWholeApp } from "@/tests/utils/generateRenderObj";
import { render, waitFor } from "@testing-library/react";
import events from "events";
import cors from "cors";
import { randomUUID } from "crypto";
import { browserClient } from "@/common/apollo/client";
import { Gender } from "@/common/gql/graphql";
import { screen } from "@testing-library/react";
import { Users } from "@/server/graphql/entities/user";
import md5 from "md5";
import userEvent from "@testing-library/user-event";
let server: Server;
const mylistener = new events();
const PORT = parseInt(process.env.PORT as string) || 3006;
const correct_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im11c2tldGVlcmR0QGdtYWlsLmNvbSIsImlhdCI6MTcyNTc5NTY1M30.KqJ9-x4TrVzu4hrEKBP2b6bNpA6uhK48G1VJ5D0eTXc";
const genderMap = new Map<string, string>();
genderMap.set("male", "Male");
genderMap.set("female", "Female");
genderMap.set("nottosay", "Prefer not to say");
const TESTUSER_ARR = [
	{
		email: "musketeerdt@gmail.com",
		id: randomUUID(),
		password: "testpassword",
		name: "testuser-dy_9",
		bio: "mybio:hello",
		website: "www.bing.com",
		gender: genderMap.get(Gender.Nottosay),
		avatar: "https://cdn.whatever.com/7777",
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
	localStorage.setItem("token", correct_token);
	window.location.pathname = "/";
});
afterEach(async () => {
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
describe("Edit Profile", () => {
	jest.setTimeout(100000);
	test("load state when loading", async () => {
		render(
			generateWholeApp(undefined, {
				initialEntries: ["/options/editProfile"],
				initialIndex: 0,
			}),
		);
		await screen.findByDisplayValue(MAIN_CHARACTER.name, undefined, {
			timeout: 3000,
		});
		await screen.findByDisplayValue(MAIN_CHARACTER.website!, undefined, {
			timeout: 3000,
		});
		await screen.findByDisplayValue(MAIN_CHARACTER.bio!, undefined, {
			timeout: 3000,
		});
		await screen.findByText(MAIN_CHARACTER.gender!, undefined, {
			timeout: 3000,
		});
		const avatar: HTMLImageElement = await screen.findByAltText("avatar");
		expect(avatar.src).toBe(MAIN_CHARACTER.avatar);
	});
	test("username length restriction", async () => {
		render(
			generateWholeApp(undefined, {
				initialEntries: ["/options/editProfile"],
				initialIndex: 0,
			}),
		);
		userEvent.clear(
			await screen.findByLabelText("Username", undefined, {
				timeout: 3000,
			}),
		);
		userEvent.click(await screen.findByLabelText("Username"));
		userEvent.keyboard("abc");
		await screen.findByText("Too Short!");
		userEvent.click(await screen.findByText("Submit"));
		userEvent.clear(await screen.findByLabelText("Username"));
		userEvent.click(await screen.findByLabelText("Username"));
		userEvent.keyboard(
			"herfweffdjkwledflwejkodfjiowedfjwejdfuiwefdfefuhfidjnwfjhnweffefgverfguidf",
		);
		expect(
			((await screen.findByLabelText("Username")) as HTMLInputElement)
				.value.length,
		).toBe(18);
		expect(
			(
				await UserRepo.findOne({
					where: {
						id: MAIN_CHARACTER.id,
					},
				})
			)?.name,
		).toBe(MAIN_CHARACTER.name);
	});
	test("update user submit", async () => {
		const NEW_INFO = {
			name: "my_new_name",
			bio: "my_new_bio",
			website: "https://newweb.com/edyuyh/888",
			gender: Gender.Female,
		};
		render(
			generateWholeApp(undefined, {
				initialEntries: ["/options/editProfile"],
				initialIndex: 0,
			}),
		);
		userEvent.clear(
			await screen.findByLabelText("Username", undefined, {
				timeout: 3000,
			}),
		);
		userEvent.click(await screen.findByLabelText("Username"));
		userEvent.keyboard(NEW_INFO.name);
		userEvent.clear(await screen.findByLabelText("Website"));
		userEvent.click(await screen.findByLabelText("Website"));
		userEvent.keyboard(NEW_INFO.website);
		userEvent.clear(await screen.findByLabelText("Bio"));
		userEvent.click(await screen.findByLabelText("Bio"));
		userEvent.keyboard(NEW_INFO.bio);
		userEvent.click(await screen.findByLabelText("Gender"));
		userEvent.click(
			await screen.findByText(genderMap.get(NEW_INFO.gender)!),
		);
		userEvent.click(await screen.findByText("Submit"));
		await waitFor(async () => {
			const { name, bio, gender, website } = (await UserRepo.findOne({
				where: {
					id: MAIN_CHARACTER.id,
				},
			}))!;
			expect({ name, bio, gender, website }).toEqual({
				...NEW_INFO,
				gender: genderMap.get(NEW_INFO.gender),
			});
		});
	});
});
