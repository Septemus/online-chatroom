import { gql } from "@/common/gql";

export const MESSAGE = gql(
	`
        query MessageQuery($data: getMessageInput!) {
            Message(data: $data) {
                notes {
                    id
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
export const SUBSCRIBE_NEW_NOTE = gql(`
    subscription subToNewNote($recipientId: String!) {
        newNote(recipientID: $recipientId) {
            target_id
            newNote {
                id
                content
                createdDate
                sender {
                    id
                }
            }
        }
    }
`);
