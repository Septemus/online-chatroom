import Sidebar from "@/content/components/sidebar";
import "./App.scss";
import { Outlet } from "react-router-dom";
import { selectId, selectStatus, verifyToken } from "./store/userSlice";
import { useAppDispatch, useAppSelector } from "./hooks/store";
import RequireCondition from "./components/requireCondition";
import { useEffect } from "react";
function App() {
	const id = useAppSelector(selectId);
	const status = useAppSelector(selectStatus);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const token = localStorage.getItem("token") ?? "";
		dispatch(verifyToken(token));
	}, []);
	return (
		<RequireCondition
			condition={id !== ""}
			loading={status === "loading"}
		>
			<div className="App">
				<Sidebar />
				<Outlet />
			</div>
		</RequireCondition>
	);
}

export default App;
