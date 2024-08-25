import Contact from "@/types/contacts/contact";
import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import { gql, useQuery } from "@apollo/client";
export default function ContactsList() {
	const { data, loading, error } = useQuery(gql`
		query usersQuery {
			users {
				id
				isOnline
				name
				avatar
			}
		}
	`);
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
