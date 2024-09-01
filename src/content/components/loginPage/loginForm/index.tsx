import { Button, Checkbox, Flex, Form, FormProps, Input } from "antd";
import React from "react";
type FieldType = {
	userid?: string;
	password?: string;
	remember?: string;
};

const LoginForm: React.FC<{
	toggler: () => void;
}> = ({ toggler }) => {
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		console.log("Success:", values);
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
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
			<Form.Item<FieldType>
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
				<Button
					className="toggle"
					onClick={toggler}
				>
					Sign Up
				</Button>
			</Form.Item>
		</Form>
	);
};

export default LoginForm;
