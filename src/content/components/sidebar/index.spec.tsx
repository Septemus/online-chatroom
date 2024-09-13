import { render, screen } from "@testing-library/react";
import Sidebar from ".";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { setUpStore } from "@/content/store";
const mockspy = jest.fn();
jest.mock("react-router-dom", () => {
	return {
		useNavigate() {
			return (param: any) => {
				mockspy(param);
			};
		},
	};
});
test("redirect when clicking items", async () => {
	render(
		<Provider store={setUpStore()}>
			<Sidebar />
		</Provider>,
	);
	let item = screen.getByRole("menuitem", { name: "message" });
	await userEvent.click(item);
	expect(mockspy).toHaveBeenCalledWith("chatroom");
	item = screen.getByRole("menuitem", { name: "user" });
	await userEvent.click(item);
	expect(mockspy).toHaveBeenCalledWith("account");
});
