import { Avatar, Button } from "antd";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
export default function EditProfile() {
	return (
		<div className="edit-profile">
			<div className="avatar-section">
				<Avatar
					icon={<UserOutlined />}
					className="avatar"
					size={56}
				/>
				<div className="info">
					<span className="username">username</span>
					<span className="email">email</span>
				</div>
				<Button type="primary">Change photo</Button>
			</div>
		</div>
	);
}
