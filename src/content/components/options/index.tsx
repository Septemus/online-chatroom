import OptionsSidebar from "./sidebar";
import "./index.scss";
import { Outlet, useLocation } from "react-router-dom";
import { optionItems } from "./sidebar";
export default function Options() {
	const loc = useLocation();
	const curPath = loc.pathname.split("/").at(-1);
	const contentTitle = optionItems.find((item) => {
		return item.key === curPath;
	})?.label;
	return (
		<div className="options">
			<OptionsSidebar></OptionsSidebar>
			<div className="content-wrapper">
				<div className="content">
					<div className="content-title">{contentTitle}</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
