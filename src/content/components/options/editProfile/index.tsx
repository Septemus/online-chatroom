import { Avatar, Button, Select } from "antd";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
export default function EditProfile() {
	const [bioLength, setBioLength] = useState(0);
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
				<input
					type="text"
					defaultValue={"myusername"}
				/>
				<div className="length-restriction">{bioLength}/150</div>
			</div>
			<div className="website-section section">
				<div className="sub-content-title">Website</div>
				<input
					type="text"
					placeholder="Website"
				/>
			</div>
			<div className="bio-section section">
				<div className="sub-content-title">Bio</div>
				<textarea
					name="bio"
					className="bio"
					onInput={(e) => {
						setBioLength(e.currentTarget.textLength);
					}}
				></textarea>
				<div className="length-restriction">{bioLength}/150</div>
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
				/>
				<div className="caption">
					This won’t be part of your public profile.
				</div>
			</div>
			<div className="section submit-section">
				<Button type="primary">Submit</Button>
				<Button>Undo</Button>
			</div>
		</div>
	);
}
