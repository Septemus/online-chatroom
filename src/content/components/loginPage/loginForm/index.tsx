import { Button, Checkbox, Flex, Form, FormProps, Input } from "antd";
import React from "react";
import { useNavigate, useSubmit } from "react-router-dom";
export type LoginFieldType = {
	userid: string;
	password: string;
	remember: string;
};

const LoginForm: React.FC = () => {
	const submit = useSubmit();
	const nav = useNavigate();
	const onFinish: FormProps<LoginFieldType>["onFinish"] = (values) => {
		submit(values, {
			method: "POST",
			action: "/login",
		});
	};
	const onFinishFailed: FormProps<LoginFieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		console.log("Failed:", errorInfo);
	};
	return (
		<Form
			className="form-wrapper"
			name="basic"
			wrapperCol={{ span: 24 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item<LoginFieldType>
				label="User ID"
				name="userid"
				rules={[
					{
						required: true,
						message: "Please input your User ID!",
					},
				]}
			>
				<Input className="field" />
			</Form.Item>

			<Form.Item<LoginFieldType>
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

			<Form.Item<LoginFieldType>
				name="remember"
				valuePropName="checked"
				wrapperCol={{ span: 24 }}
			>
				<Flex justify="flex-end">
					<Checkbox className="remember">Remember me</Checkbox>
				</Flex>
			</Form.Item>

			<Form.Item>
				<Button
					type="primary"
					className="sumit-bt"
					htmlType="submit"
				>
					Login
				</Button>
			</Form.Item>

			<Form.Item>
				<Button
					className="toggle"
					onClick={() => {
						nav("register");
					}}
				>
					Sign Up
				</Button>
			</Form.Item>
		</Form>
	);
};

export default LoginForm;
