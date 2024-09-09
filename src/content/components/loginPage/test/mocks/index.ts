import { HttpResponse, graphql } from "msw";
import { setupServer } from "msw/node";
export const loginListener = jest.fn((arg: any) => {});
export const loginMock = (...args: any) => {
	loginListener(args);
	return HttpResponse.json({
		data: {
			login: {
				msg: "登录成功",
				success: true,
				token: "fortest",
			},
		},
	});
};
export const registerListener = jest.fn((arg: any) => {});
export const registerMock = (...args: any) => {
	registerListener(args);
	return HttpResponse.json({
		data: {
			createUser: {
				msg: "注册成功",
				success: true,
			},
		},
	});
};
const handlers = [
	graphql.query("loginQuery", loginMock as any),
	graphql.mutation("addUserMuttation", registerMock as any),
];
export const server = setupServer(...handlers);
