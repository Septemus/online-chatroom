import { UserOutlined } from "@ant-design/icons";
import { Avatar, Menu, MenuProps } from "antd";
import "./index.scss";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import { useQuery } from "@apollo/client";
import { USER } from "@/common/apollo/client/user";
import { useState } from "react";
type MenuItem = Required<MenuProps>["items"][number];
type propTypes = {
	acc_id?: string;
};
export default function Account({ acc_id }: propTypes) {
	debugger;
	const myid = useAppSelector(selectId);
	const [accid, setAccid] = useState(acc_id ? acc_id : myid);
	const { loading, error, data } = useQuery(USER, {
		variables: {
			userId: accid ?? "",
		},
		pollInterval: 10000,
	});
	const isMyself = accid === myid;
	let operation_bts = (
		<>
			<button className="edit gray-bt">Edit Profile</button>
		</>
	);
	const items: MenuItem[] = [
		{
			label: "Posts",
			key: "posts",
		},
		{
			label: "Photos",
			key: "photos",
		},
	];
	if (!isMyself) {
		operation_bts = (
			<>
				<button className="edit gray-bt">Contact</button>
				<button className="edit gray-bt">Follow</button>
			</>
		);
	}
	return (
		<div className="account">
			<div className="account-top">
				<div className="row">
					<Avatar
						size={120}
						icon={<UserOutlined />}
					/>
				</div>
				<div className="row">
					<div className="username">{data?.user.name}</div>
				</div>
				<div className="row">
					<div className="userid">{data?.user.email}</div>
				</div>
				<div className="row">
					<div className="follow-info">
						<span className="follower">
							{data?.user.followers.length} followers
						</span>
						<span className="delimeter">·</span>
						<span className="following">
							{data?.user.following.length} following
						</span>
					</div>
				</div>
				<div className="row">
					<div className="operation">{operation_bts}</div>
				</div>
			</div>
			<Menu
				mode="horizontal"
				className="account-menu"
				items={items}
			/>
		</div>
	);
}
