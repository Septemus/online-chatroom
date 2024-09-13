import Contact from "@/types/contacts/contact";
import "./index.scss";
import { useQuery } from "@apollo/client";
import { USERS } from "@/common/apollo/client/queries/users";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";

export default function ContactsList() {
	const { data, loading, error } = useQuery(USERS, {
		pollInterval: 10000,
	});
	const myid = useAppSelector(selectId);
	const userList = data?.users.filter((u) => {
		return u.id != myid;
	});
	let el: JSX.Element = <div></div>;
	if (loading) {
		el = <div className="loading"></div>;
	} else if (error) {
		el = <div className="error"></div>;
	} else if (data) {
		el = (
			<ul>
				{userList!.map((item: Contact) => {
					return (
						<li className="contact-item">
							<img
								src={item.avatar}
								alt={item.name}
								className="avatar"
							/>
							<div className="item-info">
								<p className="name">{item.name}</p>
								<div className="chat-content">
									<span>history chat</span>
									<span className="devider">·</span>
									<span className="last-time">xd</span>
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
