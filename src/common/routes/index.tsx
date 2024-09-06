import App from "@/content/App";
import Account from "@/content/components/account";
import Chatroom from "@/content/components/chatroom";
import LoginPage from "@/content/components/loginPage";
import LoginForm from "@/content/components/loginPage/loginForm";
import RegisterForm from "@/content/components/loginPage/registerForm";
import { createRoutesFromElements, Route } from "react-router-dom";
import registerAction from "../apollo/client/register";

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
			path="/login"
		>
			<Route
				element={<LoginForm />}
				path=""
			></Route>
			<Route
				element={<RegisterForm />}
				path="register"
				action={registerAction}
			></Route>
		</Route>
	</>,
);
