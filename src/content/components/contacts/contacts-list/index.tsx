import Contact from "@/types/contacts/contact";
import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import { useQuery } from "@apollo/client";
import { USERS } from "@/common/apollo/client/users";

export default function ContactsList() {
	const { data, loading, error } = useQuery(USERS, {
		pollInterval: 1000,
	});
	let el: JSX.Element = <div></div>;
	if (loading) {
		el = <div className="loading"></div>;
	} else if (error) {
		el = <div className="error"></div>;
	} else if (data) {
		el = (
			<ul>
				{data.users.map((item: Contact) => {
					return (
						<li>
							<span>{item.name}</span>
							<UserOutlined
								className={item.isOnline ? "online" : "offline"}
							/>
						</li>
					);
				})}
			</ul>
		);
	}
	return <div className="contact-list">{el}</div>;
}
