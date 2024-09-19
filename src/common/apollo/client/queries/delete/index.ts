import { gql } from "@/common/gql";

export const DELETE = gql(
	`
    mutation delMutation($deleteUserId: String!) {
        deleteUser(id: $deleteUserId) {
            msg
            success
        }
    }
`,
);
