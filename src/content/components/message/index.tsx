import { ReactElement, useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useSocket } from "@/content/hooks/socket";
import classNames from "classnames";
import { Note } from "@/types/message";
import "./index.scss";
import ContactsList from "../contacts/contacts-list";
type FieldType = {
	msg: string;
};

const Message = () => {
	const [msgList, setMsgList] = useState<Note[]>([]);
	const [id, setId] = useState<string>("");
	const [msg, setMsg] = useState("");
	const [socket, isReady] = useSocket("ws://localhost:3006");
	useEffect(() => {
		if (isReady) {
			socket.onmessage = (e: MessageEvent<string>) => {
				const tmp: Note = JSON.parse(e.data);
				setMsgList([...msgList, tmp]);
				if (tmp.type === "message") {
					console.log("on message!", tmp, msgList);
				} else if (tmp.type === "init") {
					console.log("set init id!", tmp.id);
					setId(tmp.id);
				}
			};
		}
	}, [isReady, msgList, socket]);
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		console.log("Success:", values);
		const target = new Note(values.msg, id, "message");
		socket.send(JSON.stringify(target));
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		console.log("Failed:", errorInfo);
	};
	const msgListEl = msgList.map((content) => {
		let tmp: ReactElement | null = null;
		if (content.type === "message") {
			tmp = (
				<div className={content.id === id ? "self" : "other"}>
					<span>{content.id}:</span>
					{content.msg}
				</div>
			);
		} else if (content.type === "init") {
			tmp = <div className="welcome">You have joined the gang!🥷🏿</div>;
		}
		return <div className="msg-note">{tmp}</div>;
	});
	return (
		<div
			className={classNames({
				chatroom: true,
				loading: isReady,
			})}
		>
			<div className="contact-list-wrapper">
				<ContactsList />
			</div>
			<div className="message-area">
				<div className="message-screen">{msgListEl}</div>
				<Form
					name="basic"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					className="type-area"
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
						<Input
							className="type-input"
							value={msg}
							onChange={(e) => {
								setMsg(e.target.value);
							}}
						/>
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
			</div>
		</div>
	);
};

export default Message;
