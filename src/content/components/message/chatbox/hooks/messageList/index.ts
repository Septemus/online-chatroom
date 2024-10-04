import {
	MESSAGE,
	SUBSCRIBE_NEW_NOTE,
} from "@/common/apollo/client/queries/message";
import { gql } from "@/common/gql";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { SocketNote } from "@/types/message";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { produce } from "immer";
export function useMessageList({
	id1 = "",
	id2 = "",
}: {
	id1: string | undefined;
	id2: string | undefined;
}) {
	const myid = useAppSelector(selectId);
	const [msgList, setMsgList] = useState<SocketNote[]>([]);
	const [mutate] = useMutation(
		gql(
			`
			mutation addNote($data: addMessageInput!) {
				AddNote(data: $data) {
					content
					createdDate
					id
				}
			}	
		`,
		),
	);
	const {
		data: messageRecord,
		loading: messageRecordLoading,
		subscribeToMore,
	} = useQuery(MESSAGE, {
		variables: {
			data: {
				id1,
				id2,
			},
		},
		fetchPolicy: "cache-and-network",
	});
	useEffect(() => {
		if (!messageRecordLoading && messageRecord) {
			const history_notes =
				messageRecord.Message?.notes.map((n) => {
					return new SocketNote(n.content, n.sender.id, "message");
				}) ?? [];
			setMsgList(history_notes);
		}
	}, [messageRecord, messageRecordLoading]);
	useEffect(() => {
		subscribeToMore({
			document: SUBSCRIBE_NEW_NOTE,
			variables: {
				recipientId: myid,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const tmp = prev.Message?.notes.find((u) => {
					return u.id === subscriptionData.data.newNote.newNote.id;
				});
				if (!tmp) {
					return produce(prev, (draft) => {
						if (draft.Message) {
							draft.Message.notes.push(
								subscriptionData.data.newNote.newNote,
							);
						} else {
							draft.Message = {
								__typename: "Message",
								usersInvolved: [
									{ __typename: "Users", email: id1 },
									{ __typename: "Users", email: id2 },
								],
								notes: [subscriptionData.data.newNote.newNote],
							};
						}
					});
				} else {
					return prev;
				}
			},
		});
	}, []);

	return { msgList, setMsgList, mutate };
}
