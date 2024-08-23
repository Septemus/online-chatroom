import { render, screen } from "@testing-library/react";
import Sidebar from ".";
import userEvent from "@testing-library/user-event";
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
	render(<Sidebar />);
	let item = screen.getByRole("menuitem", { name: "message" });
	await userEvent.click(item);
	expect(mockspy).toHaveBeenCalledWith("chatroom");
	item = screen.getByRole("menuitem", { name: "user" });
	await userEvent.click(item);
	expect(mockspy).toHaveBeenCalledWith("account");
});
