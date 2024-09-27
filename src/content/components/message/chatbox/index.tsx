import { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import type { FormProps, InputRef } from "antd";
import { Button, Form, Input } from "antd";
import { useSocket } from "@/content/hooks/socket";
import { SocketNote } from "@/types/message";
import "./index.scss";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { AVATAR } from "@/common/apollo/client/queries/user";
import { MESSAGE } from "@/common/apollo/client/queries/message";
type FieldType = {
	msg: string;
};

const Chatbox: React.FC = () => {
	const { targetId } = useParams();
	const myid = useAppSelector(selectId);
	const [msgList, setMsgList] = useState<SocketNote[]>([]);
	const [form] = Form.useForm<FieldType>();
	const [socket, isReady] = useSocket("ws://localhost:3006");
	const { data: targetAvatar } = useQuery(AVATAR, {
		variables: {
			userId: targetId!,
		},
		fetchPolicy: "cache-first",
	});
	const { data: myAvatar } = useQuery(AVATAR, {
		variables: {
			userId: myid!,
		},
		fetchPolicy: "cache-first",
	});
	const { data: messageRecord, loading: messageRecordLoading } = useQuery(
		MESSAGE,
		{
			variables: {
				data: {
					id1: myid,
					id2: targetId!,
				},
			},
		},
	);
	useEffect(() => {
		if (isReady) {
			const intro = new SocketNote(targetId!, myid, "init");
			socket.send(JSON.stringify(intro));
			socket.onmessage = (e: MessageEvent<string>) => {
				const tmp: SocketNote = JSON.parse(e.data);
				setMsgList([...msgList, tmp]);
				console.log("on message!", tmp, msgList);
			};
		}
	}, [isReady, msgList, socket]);
	useEffect(() => {
		if (!messageRecordLoading && messageRecord) {
			const history_notes =
				messageRecord.Message?.notes.map((n) => {
					return new SocketNote(n.content, n.sender.id, "message");
				}) ?? [];
			setMsgList(history_notes);
		}
	}, [messageRecord, messageRecordLoading]);
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		console.log("Success:", values);
		const target = new SocketNote(values.msg, myid, "message");
		socket.send(JSON.stringify(target));
		form.setFieldValue("msg", "");
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		console.log("Failed:", errorInfo);
	};
	const msgListEl = msgList.map((content) => {
		let tmp: ReactElement | null = null;
		tmp = (
			<>
				<img
					src={
						content.id === myid
							? myAvatar?.user.avatar
							: targetAvatar?.user.avatar
					}
					alt="avatar"
					className="avatar"
				/>
				<div className="msg-content">{content.msg}</div>
			</>
		);
		return (
			<div
				className={
					(content.id === myid ? "self" : "other") + " msg-note"
				}
			>
				{tmp}
			</div>
		);
	});

	return (
		<>
			<div className="message-screen">{msgListEl}</div>
			<Form
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				className="type-area"
				form={form}
			>
				<Form.Item<FieldType>
					name="msg"
					rules={[
						{
							required: true,
							message: "Please input your message!",
						},
					]}
					style={{
						flexGrow: 1,
						height: "100%",
					}}
				>
					<Input className="type-input" />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};
export default Chatbox;
