import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./index.scss";
import logo from "@/content/logo.svg";
import RequireCondition from "@/content/components/requireCondition";
import { useAppDispatch, useAppSelector } from "@/content/hooks/store";
import { selectId, selectStatus, verifyToken } from "@/content/store/userSlice";
export enum LoginPageState {
	logining,
	registering,
}

const LoginPage: React.FC = () => {
	const id = useAppSelector(selectId);
	const status = useAppSelector(selectStatus);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const token = localStorage.getItem("token") ?? "";
		dispatch(verifyToken(token));
	}, []);
	return (
		<RequireCondition
			condition={id === ""}
			loading={status === "loading"}
			fallback={
				<Navigate
					to="/"
					replace
				/>
			}
		>
			<div className="loginPage">
				<div className="logo">
					<img
						src={logo}
						alt=""
					/>
				</div>
				<Outlet />
			</div>
		</RequireCondition>
	);
};

export default LoginPage;
