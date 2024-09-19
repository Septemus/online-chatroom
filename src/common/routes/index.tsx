import App from "@/content/App";
import Account from "@/content/components/account";
import Chatroom from "@/content/components/chatroom";
import LoginPage from "@/content/components/loginPage";
import LoginForm from "@/content/components/loginPage/loginForm";
import RegisterForm from "@/content/components/loginPage/registerForm";
import { createRoutesFromElements, Navigate, Route } from "react-router-dom";
import registerAction from "../apollo/client/queries/register";

import AccountPosts from "@/content/components/account/posts";
import AccountPhotos from "@/content/components/account/photos";
import Options from "@/content/components/options";
import EditProfile from "@/content/components/options/editProfile";
import loginAction from "../apollo/client/queries/login";

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
			>
				<Route
					index
					element={
						<Navigate
							to="posts"
							replace
						></Navigate>
					}
				></Route>
				<Route
					path="posts"
					element={<AccountPosts />}
				></Route>
				<Route
					path="photos"
					element={<AccountPhotos />}
				></Route>
			</Route>
			<Route
				element={<Options />}
				path="options"
			>
				<Route
					index
					element={
						<Navigate
							to="editProfile"
							replace
						></Navigate>
					}
				></Route>
				<Route
					element={<EditProfile />}
					path="editProfile"
				></Route>
			</Route>
		</Route>
		<Route
			element={<LoginPage />}
			path="/login"
			action={loginAction}
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
