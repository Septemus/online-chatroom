import "./index.scss";
import { Menu, MenuProps, message } from "antd";
import {
	LogoutOutlined,
	MessageOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LogoutConfirm from "@/content/components/modals/logoutConfirm";
import { useState } from "react";
import { useAppDispatch } from "@/content/hooks/store";
import { setId } from "@/content/store/userSlice";
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
	{
		key: "logout",
		icon: <LogoutOutlined />,
		danger: true,
	},
];
export default function Sidebar() {
	const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
	const nav = useNavigate();
	const dispatch = useAppDispatch();
	return (
		<div className="sidebar">
			<Menu
				items={items}
				defaultSelectedKeys={["chatroom"]}
				className="sideMenu"
				onClick={(e) => {
					if (e.key === "logout") {
						setOpenLogoutConfirm(true);
					} else {
						nav(e.key);
					}
				}}
			></Menu>
			<LogoutConfirm
				open={openLogoutConfirm}
				handleCancel={() => {
					setOpenLogoutConfirm(false);
				}}
				handleOk={() => {
					localStorage.removeItem("token");
					dispatch(setId(""));
					message.success("logout successful!");
					nav("/login");
				}}
			/>
		</div>
	);
}
