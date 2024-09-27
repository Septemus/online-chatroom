import { MESSAGE } from "@/common/apollo/client/queries/message";
import { SocketNote } from "@/types/message";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useMessageList({
	id1 = "",
	id2 = "",
}: {
	id1: string | undefined;
	id2: string | undefined;
}): [SocketNote[], React.Dispatch<React.SetStateAction<SocketNote[]>>] {
	const [msgList, setMsgList] = useState<SocketNote[]>([]);
	const { data: messageRecord, loading: messageRecordLoading } = useQuery(
		MESSAGE,
		{
			variables: {
				data: {
					id1,
					id2,
				},
			},
		},
	);
	useEffect(() => {
		if (!messageRecordLoading && messageRecord) {
			const history_notes =
				messageRecord.Message?.notes.map((n) => {
					return new SocketNote(n.content, n.sender.id, "message");
				}) ?? [];
			setMsgList(history_notes);
		}
	}, [messageRecord, messageRecordLoading]);

	return [msgList, setMsgList];
}
