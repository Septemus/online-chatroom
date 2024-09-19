import { Avatar, Button, Input } from "antd";
import { Select } from "formik-antd";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Gender } from "@/common/gql/graphql";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { Formik, FormikProps, Form } from "formik";
const { TextArea } = Input;
type updateField = {
	id: string;
	name: string;
	website: string;
	bio: string;
	gender: Gender | null;
};
export default function EditProfile() {
	const myid = useAppSelector(selectId);
	const initVals: updateField = {
		id: myid,
		name: "",
		website: "",
		bio: "",
		gender: null,
	};
	return (
		<Formik
			initialValues={initVals}
			onSubmit={(values) => {
				console.log(values);
			}}
		>
			{(props: FormikProps<updateField>) => (
				<Form className="edit-profile">
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
							name="name"
							showCount
							maxLength={20}
							style={{ height: 40 }}
							value={props.values.name}
							onInput={props.handleChange}
						/>
					</div>
					<div className="website-section section">
						<div className="sub-content-title">Website</div>
						<Input
							name="website"
							style={{ height: 40 }}
							value={props.values.website}
							onInput={props.handleChange}
						/>
					</div>
					<div className="bio-section section">
						<div className="sub-content-title">Bio</div>
						<TextArea
							name="bio"
							showCount
							maxLength={150}
							style={{ height: 60, resize: "none" }}
							value={props.values.bio}
							onInput={props.handleChange}
						/>
					</div>
					<div className="gender-section section">
						<div className="sub-content-title">Gender</div>
						<Select
							name="gender"
							className="gender-selection"
							options={[
								{ value: "male", label: "Male" },
								{
									value: "female",
									label: "Female",
								},
								{
									value: "nottosay",
									label: "Prefer not to say",
								},
							]}
						/>
						<div className="caption">
							This won’t be part of your public profile.
						</div>
					</div>
					<div className="section submit-section">
						<Button
							type="primary"
							className="submit"
							htmlType="submit"
						>
							Submit
						</Button>
						<Button>Undo</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}
