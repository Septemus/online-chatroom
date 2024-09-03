import { Button, Checkbox, Flex, Form, FormProps, Input } from "antd";
import { useLazyQuery, gql } from "@apollo/client";
import React from "react";
import md5 from "md5";
import { useNavigate } from "react-router-dom";
const LOGIN = gql`
	query loginQuery($data: loginInput!) {
		login(data: $data) {
			msg
			success
		}
	}
`;
type FieldType = {
	userid?: string;
	password?: string;
	remember?: string;
};

const LoginForm: React.FC = () => {
	const [login, { loading, error, data }] = useLazyQuery(LOGIN);
	const nav = useNavigate();
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		login({
			variables: {
				data: {
					id: values.userid,
					password: md5(values.password as string),
				},
			},
		}).then((res) => {
			if (res.data.login.success) {
				console.log(res.data.login.success, res.data.login.msg);
			} else {
				console.log("error", res.data.login.msg);
			}
		});
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
