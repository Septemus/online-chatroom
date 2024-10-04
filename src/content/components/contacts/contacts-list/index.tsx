import "./index.scss";
import { useQuery } from "@apollo/client";
import { USERS } from "@/common/apollo/client/queries/user/users";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import Loading from "../../loading";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import { useEffect } from "react";
import { SUBSCRIBE_NEW_NOTE } from "@/common/apollo/client/queries/message";
import { produce } from "immer";
import { dateDiffSimpleString } from "@/common/utilities/time";
export default function ContactsList() {
	const loc = useLocation();
	const nav = useNavigate();
	const selected_user = loc.pathname.split("/").at(-1);
	const myid = useAppSelector(selectId);
	const { data, loading, error, subscribeToMore } = useQuery(USERS, {
		variables: {
			finderId: myid,
		},
	});
	const userList = data?.users.filter((u) => {
		return u.id != myid;
	});
	let el: JSX.Element = <div></div>;
	useEffect(() => {
		subscribeToMore({
			document: SUBSCRIBE_NEW_NOTE,
			variables: {
				recipientId: myid,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newQueryData = produce(prev, (draft) => {
					const target = draft.users.find(
						(u) => u.id === subscriptionData.data.newNote.target_id,
					)!;
					if (target.lastNote) {
						target.lastNote!.content =
							subscriptionData.data.newNote.newNote.content;
					} else {
						target.lastNote = {
							__typename: "Note",
							content:
								subscriptionData.data.newNote.newNote.content,
							createdDate:
								subscriptionData.data.newNote.newNote
									.createdDate,
						};
					}
				});
				return newQueryData;
			},
		});
	}, []);
	if (loading) {
		el = (
			<div className="loading">
				<Loading />
			</div>
		);
	} else if (error) {
		el = <div className="error"></div>;
	} else if (data) {
		el = (
			<ul>
				{userList!.map((item) => {
					return (
						<li
							className={classnames("contact-item", {
								selected: item.id === selected_user,
							})}
							onClick={() => {
								nav(`chatbox/${item.id}`);
							}}
							key={item.id}
						>
							<img
								src={item.avatar}
								alt={item.name}
								className="avatar"
							/>
							<div className="item-info">
								<p className="name">{item.name}</p>
								<div className="chat-content">
									<span className="last-note">
										{item.lastNote?.content}
									</span>
									<span className="devider">·</span>
									<span className="last-time">
										{dateDiffSimpleString(
											new Date(),
											new Date(
												item.lastNote?.createdDate,
											),
										)}
									</span>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		);
	}
	return (
		<div className="contact-list">
			<h2 className="title">Message List</h2>
			{el}
		</div>
	);
}
