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
	test("switch between login and register", async () => {
		render(renderObj);
		let toggler = screen.getByText("Sign Up");
		await userEvent.click(toggler);
		expect(screen.getByText("Register")).toBeTruthy();
		toggler = screen.getByText("Switch To Login");
		await userEvent.click(toggler);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Default display login form", async () => {
		render(renderObj);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Confirm Password", async () => {
		render(renderObj);
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
});
