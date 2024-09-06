import { ActionFunctionArgs, redirect } from "react-router-dom";
import { client } from "..";
import { RegisterFieldType } from "@/content/components/loginPage/registerForm";
import { message } from "antd";
import { gql } from "@apollo/client";

const registerAction = async ({
	request,
	params,
}: ActionFunctionArgs<RegisterFieldType>) => {
	console.log("register action");
	const data = Object.fromEntries(await request.formData());
	const res = await client.mutate({
		mutation: REGISTER,
		variables: {
			data: {
				email: data.email,
				name: data.username,
				password: data.password,
			},
		},
		fetchPolicy: "network-only",
	});
	if (res.data.createUser.success) {
		console.log("register successful!");
		message.success("register successful!");
		return redirect("/login");
	} else {
		message.error(`register failed!${res.data.createUser.msg}`);
	}
	return null;
};
export default registerAction;
export const REGISTER = gql`
	mutation addUserMuttation($data: CreateUserInput!) {
		createUser(data: $data) {
			success
			msg
		}
	}
`;
