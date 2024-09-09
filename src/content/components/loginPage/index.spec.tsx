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
import { loginListener, registerListener, server } from "./test/mocks";
import { store } from "@/content/store";
import md5 from "md5";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/common/apollo/client";
describe("loginPage", () => {
	beforeAll(() => {
		server.events.on("request:start", ({ request }) => {
			console.log("Outgoing:", request.method, request.url);
		});
		server.listen();
	});
	afterAll(() => {
		server.close();
	});
	function generateRenderObj() {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/login"],
			initialIndex: 0,
		});
		const renderObj = (
			<Provider store={store}>
				<ApolloProvider client={client}>
					<RouterProvider router={router}></RouterProvider>
				</ApolloProvider>
			</Provider>
		);
		return renderObj;
	}
	test("switch between login and register", async () => {
		render(generateRenderObj());
		let toggler = screen.getByText("Sign Up");
		await userEvent.click(toggler);
		expect(screen.getByText("Register")).toBeTruthy();
		toggler = screen.getByText("Switch To Login");
		await userEvent.click(toggler);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Default display login form", async () => {
		render(generateRenderObj());
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Confirm Password", async () => {
		render(generateRenderObj());
		let toggler = screen.getByText("Sign Up");
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
		let toggler = screen.getByText("Sign Up");
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
	test("Login Password using md5 digest", async () => {
		loginListener.mockImplementation((arg: any) => {
			return arg[0].variables.data.password;
		});
		render(generateRenderObj());
		let email: HTMLInputElement = screen.getByLabelText("User ID/Email");
		let pwd: HTMLInputElement = screen.getByLabelText("Password");
		let submit: HTMLButtonElement = screen.getByText("Login");
		userEvent.click(email);
		userEvent.keyboard("jingjie@tencent.com");
		userEvent.click(pwd);
		userEvent.keyboard("jingjiebest");
		userEvent.click(submit);
		await waitFor(() => {
			expect(loginListener).toHaveBeenCalledTimes(1);
		});
		expect(loginListener).toHaveReturnedWith(md5("jingjiebest"));
	});
	test("Login success will save token in storage", async () => {
		render(generateRenderObj());
		let email: HTMLInputElement = screen.getByLabelText("User ID/Email");
		let pwd: HTMLInputElement = screen.getByLabelText("Password");
		let submit: HTMLButtonElement = screen.getByText("Login");
		userEvent.click(email);
		userEvent.keyboard("jingjie@tencent.com");
		userEvent.click(pwd);
		userEvent.keyboard("jingjiebest");
		userEvent.click(submit);
		await waitFor(() => {
			expect(loginListener).toHaveBeenCalledTimes(1);
		});
		await waitFor(() => {
			expect(localStorage.getItem("token")).toBe("fortest");
		});
	});
	test("Register Password using md5 digest", async () => {
		registerListener.mockImplementation((arg: any) => {
			return arg[0].variables.data.password;
		});
		render(generateRenderObj());
		let toggler = screen.getByText("Sign Up");
		userEvent.click(toggler);
		let email = screen.getByLabelText("Email");
		let username = screen.getByLabelText("Username");
		let pwd = screen.getByLabelText("Password");
		let confirm = screen.getByLabelText("Confirm Password");
		let submit = screen.getByText("Register");
		userEvent.click(email);
		userEvent.keyboard("email@qq.com");
		userEvent.click(username);
		userEvent.keyboard("username");
		userEvent.click(pwd);
		userEvent.keyboard("jingjie123");
		userEvent.click(confirm);
		userEvent.keyboard("jingjie123");
		userEvent.click(submit);
		await waitFor(() => {
			expect(registerListener).toHaveBeenCalledTimes(1);
		});
		expect(registerListener).toHaveReturnedWith(md5("jingjie123"));
	});
});
