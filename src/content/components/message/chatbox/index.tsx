import { ReactElement, useEffect, useRef } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import "./index.scss";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AVATAR } from "@/common/apollo/client/queries/user";
import { useMessageList } from "./hooks/messageList";
import Loading from "@/content/components/loading";
import TopInfoBar from "./topinfobar";
type FieldType = {
	msg: string;
};

const Chatbox: React.FC = () => {
	const { targetId } = useParams();
	const myid = useAppSelector(selectId);
	const { msgList, mutate } = useMessageList({
		id1: myid,
		id2: targetId,
	});
	const [form] = Form.useForm<FieldType>();
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
	const msg_screen_bottom = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (msg_screen_bottom.current && msgList.length) {
			msg_screen_bottom.current.scrollIntoView();
		}
	}, [msg_screen_bottom, msgList]);
	const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
		console.log("Success:", values);
		mutate({
			variables: {
				data: {
					content: values.msg,
					id1: myid,
					id2: targetId!,
					sender: myid,
				},
			},
		});
		form.setFieldValue("msg", "");
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		console.log("Failed:", errorInfo);
	};
	const msgListEl = msgList.map((content, index) => {
		let tmp: ReactElement | null = null;
		tmp = (
			<>
				<Link to={`/account/${content.id === myid ? "" : content.id}`}>
					<img
						src={
							content.id === myid
								? myAvatar?.user.avatar
								: targetAvatar?.user.avatar
						}
						alt="avatar"
						className="avatar"
					/>
				</Link>
				<div className="msg-content">{content.msg}</div>
			</>
		);
		return (
			<div
				className={
					(content.id === myid ? "self" : "other") + " msg-note"
				}
				key={content.msg + index}
			>
				{tmp}
			</div>
		);
	});
	// if (!isReady) {
	// 	return <Loading />;
	// }
	return (
		<>
			<TopInfoBar id={targetId} />
			<div className="message-screen">
				{msgListEl}
				<div
					className="bottom"
					ref={msg_screen_bottom}
				></div>
			</div>
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
