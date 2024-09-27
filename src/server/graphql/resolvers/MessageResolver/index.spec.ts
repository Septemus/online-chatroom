import { randomUUID } from "crypto";
import { AppDataSource, BookRepo, MessageRepo, UserRepo } from "../../typeorm";
import { Users } from "../../entities/user";
import md5 from "md5";
import { newNote, selectMessageBetween } from ".";
const TESTUSER_ARR = [
	{
		email: "musketeerdt@gmail.com",
		id: "hefbhcej",
		password: "testpassword",
		name: "testuser-dy_9",
		bio: "mybio:hello",
		website: "www.bing.com",
		avatar: "https://cdn.whatever.com/7777",
	},
	{
		email: "test@jest.com",
		id: "ebudejjk",
		password: "testpassword",
		name: "testuser",
	},
	{
		email: "abc@jest.com",
		id: "febfuwui",
		password: "testpassword2",
		name: "testuser2",
	},
];
beforeAll(async () => {
	await AppDataSource.initialize();
});

beforeEach(async () => {
	await UserRepo.delete({});
	await BookRepo.clear();
	await MessageRepo.delete({});
	for (const USER of TESTUSER_ARR) {
		const u = new Users();
		Object.assign(u, USER);
		u.password = md5(u.password);
		await UserRepo.save(u);
	}
});
afterAll(async () => {
	await UserRepo.delete({});
	await BookRepo.clear();
	await MessageRepo.delete({});
	await AppDataSource.destroy();
});

describe("Message Resolver", () => {
	jest.setTimeout(10000);
	test("selectMessageBetween", async () => {
		const test_content = "test_content";
		const res0 = await selectMessageBetween(
			TESTUSER_ARR[0].id,
			TESTUSER_ARR[1].id,
		);
		expect(res0).toBe(null);
		await newNote({
			id1: TESTUSER_ARR[0].id,
			id2: TESTUSER_ARR[1].id,
			content: test_content,
			sender: TESTUSER_ARR[0].id,
		});
		const res1 = await selectMessageBetween(
			TESTUSER_ARR[0].id,
			TESTUSER_ARR[1].id,
		);
		expect(
			res1?.usersInvolved.find((u) => {
				return u.id === TESTUSER_ARR[0].id;
			}),
		).toBeTruthy();
		expect(
			res1?.usersInvolved.find((u) => {
				return u.id === TESTUSER_ARR[1].id;
			}),
		).toBeTruthy();
		expect(res1?.notes[0].content).toBe(test_content);
	});
});
