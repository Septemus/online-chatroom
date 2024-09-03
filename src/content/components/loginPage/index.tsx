import React from "react";
import { Outlet } from "react-router-dom";
import "./index.scss";
import logo from "@/content/logo.svg";

export enum LoginPageState {
	logining,
	registering,
}

const LoginPage: React.FC = () => {
	return (
		<div className="loginPage">
			<div className="logo">
				<img
					src={logo}
					alt=""
				/>
			</div>
			<Outlet />
		</div>
	);
};

export default LoginPage;
