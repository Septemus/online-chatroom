import { gql } from "@/common/gql";
import { updateField } from "@/content/components/options/editProfile";
import { ActionFunctionArgs } from "react-router-dom";
import { browserClient } from "../..";
import { message } from "antd";

export const USER = gql(
	`
    query userQuery($userId: String!) {
        user(id: $userId) {
        id
        name
        email
        avatar
        isOnline
        bio
        website
        gender
        followers {
            id
        }
        following {
            id
        }
        }
    }
`,
);

export const UPDATE_USER = gql(
	`
        mutation updUser($data: UpdateUserInput!) {
            updateUser(data: $data) {
                success
                msg
            }
        }
    `,
);
export const editProfileAction = async ({
	request,
	params,
}: ActionFunctionArgs) => {
	console.log("update action");
	const data: updateField = Object.fromEntries(
		await request.formData(),
	) as updateField;
	const res = await browserClient.mutate({
		mutation: UPDATE_USER,
		variables: {
			data,
		},
		fetchPolicy: "no-cache",
	});
	if (res.data?.updateUser.success) {
		console.log("update user successful!");
		message.success("update user successful!");
	} else {
		message.error(`update user failed!${res.data?.updateUser.msg}`);
	}
	return null;
};
