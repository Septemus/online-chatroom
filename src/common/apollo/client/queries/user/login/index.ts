import { message } from "antd";
import { ActionFunctionArgs, redirect } from "react-router-dom";
import { LoginFieldType } from "@/content/components/loginPage/loginForm";
// import { gql } from "@apollo/client";
import { gql } from "@/common/gql";
import { store } from "@/content/store";
import { setId } from "@/content/store/userSlice";
import md5 from "md5";
import { browserClient } from "@/common/apollo/client";

export const LOGIN = gql(`
	query loginQuery($data: loginInput!) {
		login(data: $data) {
			msg
			success
			token
		}
	}
`);
const loginAction = async ({ request, params }: ActionFunctionArgs) => {
	console.log("login action");
	const data: LoginFieldType = Object.fromEntries(
		await request.formData(),
	) as LoginFieldType;
	const res = await browserClient.query({
		query: LOGIN,
		variables: {
			data: {
				id: data.userid as string,
				password: md5(data.password as string),
			},
		},
		fetchPolicy: "no-cache",
	});
	if (res.data.login.success) {
		console.log("login successful!");
		store.dispatch(setId(data.userid as string));
		message.success("login successful!");
		localStorage.setItem("token", res.data.login.token as string);
		return redirect("/");
	} else {
		message.error(`login failed!${res.data.login.msg}`);
	}
	return null;
};
export default loginAction;
