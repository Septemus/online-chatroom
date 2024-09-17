import OptionsSidebar from "./sidebar";
import "./index.scss";
import { Outlet } from "react-router-dom";
export default function Options() {
	return (
		<div className="options">
			<OptionsSidebar></OptionsSidebar>
			<div className="content">
				<Outlet />
			</div>
		</div>
	);
}
