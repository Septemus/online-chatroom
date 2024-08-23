import Sidebar from "@/content/components/sidebar";
import "./App.scss";
import { Outlet } from "react-router-dom";
function App() {
	return (
		<div className="App">
			<Sidebar />
			<Outlet />
		</div>
	);
}

export default App;
