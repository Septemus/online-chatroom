import { Button, Form, FormProps, Input } from "antd";
import React, { useRef } from "react";
import { useNavigate, useSubmit } from "react-router-dom";
export type RegisterFieldType = {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
};
const RegisterForm: React.FC = () => {
	// const [register, { loading, error, data }] = useMutation(REGISTER);
	const submit = useSubmit();
	const toggle = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
	const nav = useNavigate();
	const onFinish: FormProps<RegisterFieldType>["onFinish"] = (values) => {
		console.log("Fields Check Success:", values);
		submit(values, {
			action: "/login/register",
			method: "POST",
		});
	};

	const onFinishFailed: FormProps<RegisterFieldType>["onFinishFailed"] = (
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
				<Form.Item<RegisterFieldType>
					label="Email"
					name="email"
					rules={[
						{
							type: "email",
							message: "The input is not valid E-mail!",
						},
						{
							required: true,
							message: "Please input your Username!",
						},
					]}
				>
					<Input className="field" />
				</Form.Item>
				<Form.Item<RegisterFieldType>
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your Username!",
						},
						{
							min: 4,
							max: 18,
							message:
								"Username length must be between 4 and 18!",
						},
					]}
				>
					<Input className="field" />
				</Form.Item>

				<Form.Item<RegisterFieldType>
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

				<Form.Item<RegisterFieldType>
					label="Confirm Password"
					name="confirmPassword"
					dependencies={["password"]}
					rules={[
						{
							required: true,
							message: "Please confirm your password!",
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (
									!value ||
									getFieldValue("password") === value
								) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error(
										"The new password that you entered do not match!",
									),
								);
							},
						}),
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
						ref={toggle}
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
