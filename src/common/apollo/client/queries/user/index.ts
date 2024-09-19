import { gql } from "@/common/gql";

export const USER = gql(
	`
    query userQuery($userId: String!) {
        user(id: $userId) {
        id
        name
        email
        avatar
        isOnline
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
