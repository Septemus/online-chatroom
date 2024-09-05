import { LOGIN } from "../../loginForm";
import { REGISTER } from "../../registerForm";
export const apolloMocks = [
	{
		request: {
			query: LOGIN,
		},
		variableMatcher: (variable: any) => true,
		result: {
			data: {
				login: {
					msg: "登录成功",
					success: true,
				},
			},
		},
	},
	{
		request: {
			query: REGISTER,
		},
		variableMatcher: (variables: any) => true,
		result: {
			data: {
				login: {
					msg: "注册成功",
					success: true,
				},
			},
		},
	},
];
