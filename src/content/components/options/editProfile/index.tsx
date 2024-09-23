import { Button, Input } from "antd";
import { Select } from "formik-antd";
import "./index.scss";
import { useEffect, useRef } from "react";
import { Gender } from "@/common/gql/graphql";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { Formik, FormikProps, Form } from "formik";
import { useSubmit } from "react-router-dom";
import * as Yup from "yup";
import { TransitionWrapper } from "../../transition";
import { useLazyQuery } from "@apollo/client";
import { USER } from "@/common/apollo/client/queries/user";
import Loading from "../../loading";
import _ from "lodash";
import changeAvatar from "./changeAvatar";
const { TextArea } = Input;
export type updateField = {
	id: string;
	name: string;
	website: string;
	bio: string;
	gender: Gender | null;
	avatar: string;
};
const editSchema = Yup.object().shape({
	name: Yup.string().min(4, "Too Short!"),
});
export default function EditProfile() {
	const myid = useAppSelector(selectId);
	const avatarPreview = useRef<HTMLImageElement | null>(null);
	const [getInfo, { loading, error, data }] = useLazyQuery(USER, {
		variables: {
			userId: myid,
		},
	});
	const submit = useSubmit();
	useEffect(() => {
		getInfo();
	}, []);
	const initVals: updateField = {
		id: myid,
		name: "",
		website: "",
		bio: "",
		gender: null,
		avatar: "/images/avatars/default.jpg",
	};
	let el = (
		<div className="edit-profile">
			<Loading />
		</div>
	);
	if (!loading && data) {
		const { name, website, bio, gender, email, avatar } = data.user;
		Object.assign(initVals, { name, website, bio, gender, avatar });
		el = (
			<Formik
				initialValues={initVals}
				onSubmit={(values) => {
					submit(values, {
						method: "POST",
					});
				}}
				validationSchema={editSchema}
			>
				{(props: FormikProps<updateField>) => (
					<Form className="edit-profile">
						<div className="avatar-section">
							<div className="avatar">
								<img
									src={props.values.avatar}
									alt="avatar"
									ref={avatarPreview}
									onLoad={(e) => {
										console.log("image loaded!");
										if (
											e.currentTarget.src.includes(
												";base64,",
											)
										) {
											props.setValues(
												Object.assign(
													{},
													props.values,
													{
														avatar: e.currentTarget
															.src,
													},
												),
											);
										}
									}}
								/>
							</div>
							<div className="info">
								<span className="username">{name}</span>
								<span className="email">{email}</span>
							</div>
							<Button
								type="primary"
								onClick={() => {
									changeAvatar(avatarPreview.current!);
								}}
							>
								Change photo
							</Button>
						</div>
						<div className="section username-section">
							<label
								className="sub-content-title"
								htmlFor="username_input"
							>
								Username
							</label>
							<Input
								id="username_input"
								name="name"
								showCount
								maxLength={18}
								style={{ height: 40 }}
								value={props.values.name}
								onInput={props.handleChange}
							/>
							<TransitionWrapper
								inProp={!!props.errors.name}
								duration={300}
								delay={1000}
								transitionMap={{
									entering: { height: 0 },
									entered: { height: 20 },
									exiting: { height: 20 },
									exited: { height: 0 },
								}}
							>
								<div className="error">
									<span>{props.errors.name}</span>
								</div>
							</TransitionWrapper>
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
								disabled={_.isEqual(props.values, initVals)}
							>
								Submit
							</Button>
							<Button
								onClick={() => {
									props.setValues(initVals);
								}}
								disabled={_.isEqual(props.values, initVals)}
							>
								Undo
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		);
	}
	return el;
}
