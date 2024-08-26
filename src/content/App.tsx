import Sidebar from "@/content/components/sidebar";
import "./App.scss";
import { Outlet } from "react-router-dom";
import { selectId } from "./store/userSlice";
import { useAppSelector } from "./hooks/store";
import RequireCondition from "./components/requireCondition";
function App() {
	const id = useAppSelector(selectId);
	return (
		<RequireCondition condition={id !== ""}>
			<div className="App">
				<Sidebar />
				<Outlet />
			</div>
		</RequireCondition>
	);
}

export default App;
