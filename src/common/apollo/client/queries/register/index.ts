import { ActionFunctionArgs, redirect } from "react-router-dom";
import { RegisterFieldType } from "@/content/components/loginPage/registerForm";
import { message } from "antd";
import { gql } from "@/common/gql";
import md5 from "md5";
import { browserClient } from "../..";

const registerAction = async ({ request, params }: ActionFunctionArgs) => {
	const data: RegisterFieldType = Object.fromEntries(
		await request.formData(),
	) as RegisterFieldType;
	const res = await browserClient.mutate({
		mutation: REGISTER,
		variables: {
			data: {
				email: data.email,
				name: data.username,
				password: md5(data.password as string),
			},
		},
		fetchPolicy: "no-cache",
	});
	if (res.data!.createUser.success) {
		console.log("register successful!");
		message.success("register successful!");
		return redirect("/login");
	} else {
		message.error(`register failed!${res.data!.createUser.msg}`);
	}
	return null;
};
export default registerAction;
export const REGISTER = gql(`
	mutation addUserMuttation($data: CreateUserInput!) {
		createUser(data: $data) {
			success
			msg
		}
	}
`);
