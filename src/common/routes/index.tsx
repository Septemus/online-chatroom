import App from "@/content/App";
import Account from "@/content/components/account";
import Message from "@/content/components/message";
import LoginPage from "@/content/components/loginPage";
import LoginForm from "@/content/components/loginPage/loginForm";
import RegisterForm from "@/content/components/loginPage/registerForm";
import { createRoutesFromElements, Navigate, Route } from "react-router-dom";
import registerAction from "@/common/apollo/client/queries/user/register";

import AccountPosts from "@/content/components/account/posts";
import AccountPhotos from "@/content/components/account/photos";
import Options from "@/content/components/options";
import EditProfile from "@/content/components/options/editProfile";
import loginAction from "@/common/apollo/client/queries/user/login";
import { editProfileAction } from "../apollo/client/queries/user";
import Chatbox from "@/content/components/message/chatbox";

export default createRoutesFromElements(
	<>
		<Route
			element={<App />}
			path="/"
		>
			<Route
				element={<Message />}
				path="message"
			>
				<Route
					element={<Chatbox />}
					path="chatbox/:targetId"
				/>
			</Route>
			<Route
				element={<Account />}
				path="account/:targetId?"
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
					action={editProfileAction}
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
