import "./index.scss";
import ContactsList from "../contacts/contacts-list";
import { Outlet } from "react-router-dom";

const Message = () => {
	return (
		<div className="chatroom">
			<div className="contact-list-wrapper">
				<ContactsList />
			</div>
			<div className="message-area">
				<Outlet />
			</div>
		</div>
	);
};

export default Message;
