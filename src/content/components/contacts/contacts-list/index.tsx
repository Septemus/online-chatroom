import Contact from "@/types/contacts/contact";
import "./index.scss";
import { useQuery } from "@apollo/client";
import { USERS } from "@/common/apollo/client/queries/user/users";
import { useAppSelector } from "@/content/hooks/store";
import { selectId } from "@/content/store/userSlice";
import Loading from "../../loading";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
export default function ContactsList() {
	const loc = useLocation();
	const nav = useNavigate();
	const selected_user = loc.pathname.split("/").at(-1);
	const { data, loading, error } = useQuery(USERS);
	const myid = useAppSelector(selectId);
	const userList = data?.users.filter((u) => {
		return u.id != myid;
	});
	let el: JSX.Element = <div></div>;
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
				{userList!.map((item: Contact) => {
					return (
						<li
							className={classnames("contact-item", {
								selected: item.id === selected_user,
							})}
							onClick={() => {
								nav(`chatbox/${item.id}`);
							}}
						>
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
