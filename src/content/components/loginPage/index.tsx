import React, { useState } from "react";
import "./index.scss";
import logo from "@/content/logo.svg";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";

export enum LoginPageState {
	logining,
	registering,
}

const LoginPage: React.FC = () => {
	const [current, setCurrent] = useState<LoginPageState>(
		LoginPageState.logining,
	);
	let displaying = (
		<LoginForm
			toggler={() => {
				setCurrent(LoginPageState.registering);
			}}
		/>
	);
	if (current === LoginPageState.registering) {
		displaying = (
			<RegisterForm
				toggler={() => {
					setCurrent(LoginPageState.logining);
				}}
			/>
		);
	}
	return (
		<div className="loginPage">
			<div className="logo">
				<img
					src={logo}
					alt=""
				/>
			</div>
			{displaying}
		</div>
	);
};

export default LoginPage;
