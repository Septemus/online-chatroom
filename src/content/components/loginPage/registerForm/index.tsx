import { Button, Form, FormProps, Input } from "antd";
import React from "react";
type FieldType = {
	username?: string;
	password?: string;
};
const RegisterForm: React.FC<{
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
						onClick={toggler}
					>
						Switch To Login
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default RegisterForm;
