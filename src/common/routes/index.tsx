import App from "@/content/App";
import Account from "@/content/components/account";
import Chatroom from "@/content/components/chatroom";
import LoginPage from "@/content/components/loginPage";
import { createRoutesFromElements, Route } from "react-router-dom";

export default createRoutesFromElements(
	<>
		<Route
			element={<App />}
			path="/"
		>
			<Route
				element={<Chatroom />}
				path="chatroom"
			></Route>
			<Route
				element={<Account />}
				path="account"
			></Route>
		</Route>
		<Route
			element={<LoginPage />}
			path="login"
		></Route>
	</>,
);
