import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import "./index.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
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
		<div className="opt-sidebar">
			<div className="title">Options</div>
			<Menu
				items={items}
				selectedKeys={[current]}
				className="menu-list"
			></Menu>
		</div>
	);
}
