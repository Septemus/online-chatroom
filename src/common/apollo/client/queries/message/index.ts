import { gql } from "@/common/gql";

export const MESSAGE = gql(
	`
        query MessageQuery($data: getMessageInput!) {
            Message(data: $data) {
                notes {
                    content
                    createdDate
                    sender {
                        id
                    }
                }
                usersInvolved {
                   email
                }
            }
        }
    `,
);
