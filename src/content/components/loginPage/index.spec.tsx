import userEvent from "@testing-library/user-event";
import LoginPage from ".";
import { render, screen } from "@testing-library/react";
describe("loginPage", () => {
	test("switch between login and register", async () => {
		render(<LoginPage />);
		let toggler = screen.getByText("Sign Up");
		await userEvent.click(toggler);
		expect(screen.getByText("Register")).toBeTruthy();
		toggler = screen.getByText("Switch To Login");
		await userEvent.click(toggler);
		expect(screen.getByText("Login")).toBeTruthy();
	});
	test("Default display login form", async () => {
		render(<LoginPage />);
		expect(screen.getByText("Login")).toBeTruthy();
	});
});
