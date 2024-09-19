import { Avatar, Button, Input, Select } from "antd";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
const { TextArea } = Input;

export default function EditProfile() {
	const [changed, setChanged] = useState(false);
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
			<div className="section username-section">
				<div className="sub-content-title">Username</div>
				<Input
					showCount
					maxLength={20}
					style={{ height: 40 }}
				/>
			</div>
			<div className="website-section section">
				<div className="sub-content-title">Website</div>
				<Input style={{ height: 40 }} />
			</div>
			<div className="bio-section section">
				<div className="sub-content-title">Bio</div>
				<TextArea
					showCount
					maxLength={150}
					style={{ height: 60, resize: "none" }}
				/>
			</div>
			<div className="gender-section section">
				<div className="sub-content-title">Gender</div>
				<Select
					className="gender-selection"
					options={[
						{ value: "male", label: "Male" },
						{ value: "female", label: "Female" },
						{ value: "nottosay", label: "Prefer not to say" },
					]}
					onChange={(e) => {
						setChanged(true);
					}}
				/>
				<div className="caption">
					This won’t be part of your public profile.
				</div>
			</div>
			<div className="section submit-section">
				<Button
					type="primary"
					disabled={!changed}
					className="submit"
				>
					Submit
				</Button>
				<Button disabled={!changed}>Undo</Button>
			</div>
		</div>
	);
}
