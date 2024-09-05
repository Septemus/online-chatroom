import { Button, Form, FormProps, Input } from "antd";
import { useMutation, gql } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import md5 from "md5";
export const REGISTER = gql`
	mutation addUserMuttation($data: CreateUserInput!) {
		createUser(data: $data) {
			success
			msg
		}
	}
`;
type FieldType = {
	username?: string;
	password?: string;
};
const RegisterForm: React.FC = () => {
	const [register, { loading, error, data }] = useMutation(REGISTER);
	const nav = useNavigate();
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		console.log("Fields Check Success:", values);
		register({
			variables: {
				data: {
					name: values.username,
					password: md5(values.password as string),
				},
			},
		}).then((res) => {
			if (res.data.createUser.success) {
				console.log(1);
			} else {
				console.log("register failed!", res.data.createUser.msg);
			}
		});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		console.log("Failed:", errorInfo);
	};
	return (
		<>
			<Form
				className="form-wrapper"
				name="basic"
				wrapperCol={{ span: 24 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item<FieldType>
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your Username!",
						},
					]}
				>
					<Input className="field" />
				</Form.Item>

				<Form.Item<FieldType>
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					<Input.Password className="field" />
				</Form.Item>

				<Form.Item<FieldType>
					label="Confirm Password"
					rules={[
						{
							required: true,
							message: "Please confirm your password!",
						},
					]}
				>
					<Input.Password className="field" />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						className="sumit-bt"
						htmlType="submit"
					>
						Register
					</Button>
				</Form.Item>

				<Form.Item>
					<Button
						className="toggle"
						onClick={() => {
							nav("..");
						}}
					>
						Switch To Login
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default RegisterForm;
