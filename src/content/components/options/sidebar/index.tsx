import { UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import "./index.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/interface";

export const optionItems: MenuItemType[] = [
	{
		key: "editProfile",
		label: "Edit Profile",
		icon: <UserOutlined />,
	},
];

export default function OptionsSidebar() {
	const [current, setCurrent] = useState<string>("");
	const loc = useLocation();
	useEffect(() => {
		setCurrent(loc.pathname.split("/").at(-1) as string);
	}, [loc]);
	return (
		<div className="opt-sidebar-wrapper">
			<div className="opt-sidebar">
				<div className="title">Options</div>
				<Menu
					items={optionItems}
					selectedKeys={[current]}
					className="menu-list"
				></Menu>
			</div>
		</div>
	);
}
