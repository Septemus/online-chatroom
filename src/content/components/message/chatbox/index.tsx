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
import { useMessageList } from "./hooks/messageList";
import Loading from "@/content/components/loading";
type FieldType = {
	msg: string;
};

const Chatbox: React.FC = () => {
	const { targetId } = useParams();
	const myid = useAppSelector(selectId);
	const [msgList, setMsgList] = useMessageList({ id1: myid, id2: targetId });
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
	useEffect(() => {
		if (isReady) {
			if (targetId && myid && myid !== "hydrating") {
				const intro = new SocketNote(targetId!, myid, "init");
				socket.send(JSON.stringify(intro));
			}
			socket.onmessage = (e: MessageEvent<string>) => {
				const tmp: SocketNote = JSON.parse(e.data);
				setMsgList([...msgList, tmp]);
				console.log("on message!", tmp, msgList);
			};
		}
	}, [isReady, msgList, socket, myid, targetId, setMsgList]);
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
	if (!isReady) {
		return <Loading />;
	}
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
