import "./index.scss";
import { Menu, MenuProps } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
	{
		key: "chatroom",
		icon: <MessageOutlined />,
	},
	{
		key: "myaccount",
		icon: <UserOutlined />,
	},
];
export default function Sidebar() {
	return (
		<div className="sidebar">
			<Menu
				items={items}
				defaultSelectedKeys={["chatroom"]}
				className="sideMenu"
			></Menu>
		</div>
	);
}
