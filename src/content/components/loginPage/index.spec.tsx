import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
import routes from "@/common/routes";
import userEvent from "@testing-library/user-event";
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { apolloMocks } from "./test/mocks";
import { store } from "@/content/store";
describe("loginPage", () => {
	function generateRenderObj() {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/login"],
			initialIndex: 0,
		});
		const renderObj = (
			<Provider store={store}>
				<MockedProvider mocks={apolloMocks}>
					<RouterProvider router={router}></RouterProvider>
				</MockedProvider>
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
});
