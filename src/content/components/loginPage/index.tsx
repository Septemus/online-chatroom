import React from "react";
import "./index.scss";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import logo from "@/content/logo.svg";
type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
	console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

const LoginPage: React.FC = () => (
	<div className="loginPage">
		<div className="logo">
			<img
				src={logo}
				alt=""
			/>
		</div>
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
					{ required: true, message: "Please input your username!" },
				]}
			>
				<Input className="field" />
			</Form.Item>

			<Form.Item<FieldType>
				label="Password"
				name="password"
				rules={[
					{ required: true, message: "Please input your password!" },
				]}
			>
				<Input.Password className="field" />
			</Form.Item>

			<Form.Item<FieldType>
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
				>
					Login
				</Button>
			</Form.Item>

			<Form.Item>
				<Button className="go-register">Sign Up</Button>
			</Form.Item>
		</Form>
	</div>
);

export default LoginPage;
