import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
import routes from "@/common/routes";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { apolloMocks } from "./test/mocks";
import { store } from "@/content/store";
describe("loginPage", () => {
	test("switch between login and register", async () => {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/login"],
			initialIndex: 0,
		});
		render(
			<Provider store={store}>
				<MockedProvider mocks={apolloMocks}>
					<RouterProvider router={router}></RouterProvider>
				</MockedProvider>
			</Provider>,
		);
		let toggler = screen.getByText("Sign Up");
		await userEvent.click(toggler);
		expect(screen.getByText("Register")).toBeTruthy();
		toggler = screen.getByText("Switch To Login");
		await userEvent.click(toggler);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Default display login form", async () => {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/login"],
			initialIndex: 0,
		});
		render(
			<Provider store={store}>
				<MockedProvider mocks={apolloMocks}>
					<RouterProvider router={router}></RouterProvider>
				</MockedProvider>
			</Provider>,
		);
		expect(screen.getByText("Login")).toBeTruthy();
	});
});
