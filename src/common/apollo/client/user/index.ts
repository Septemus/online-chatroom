import { gql } from "@/common/gql";

export const USER = gql(
	`
    query userQuery($userId: String!) {
        user(id: $userId) {
        password
        id
        name
        email
        avatar
        isOnline
        }
    }
`,
);
