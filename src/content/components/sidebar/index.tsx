import "./index.scss";
import { Menu, MenuProps } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
	{
		key: "chatroom",
		icon: <MessageOutlined />,
	},
	{
		key: "account",
		icon: <UserOutlined />,
	},
];
export default function Sidebar() {
	const nav = useNavigate();
	return (
		<div className="sidebar">
			<Menu
				items={items}
				defaultSelectedKeys={["chatroom"]}
				className="sideMenu"
				onClick={(e) => {
					nav(e.key);
				}}
			></Menu>
		</div>
	);
}
