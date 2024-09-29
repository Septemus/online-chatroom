import { useQuery } from "@apollo/client";
import "./index.scss";
import { USER } from "@/common/apollo/client/queries/user";
import { Link } from "react-router-dom";
import { CameraOutlined, PhoneOutlined } from "@ant-design/icons";
const TopInfoBar: React.FC<{ id?: string | undefined }> = ({ id = "" }) => {
	const { data } = useQuery(USER, {
		variables: {
			userId: id,
		},
		fetchPolicy: "cache-first",
	});
	return (
		<div className="top-info-bar">
			<Link
				className="link-wrapper"
				to={`/account/${id}`}
			>
				<img
					src={data?.user.avatar}
					alt=""
					className="avatar"
				/>
			</Link>
			<div className="name">{data?.user.name}</div>
			<div className="opration-bts">
				<PhoneOutlined className="opr-bt" />
				<CameraOutlined className="opr-bt" />
			</div>
		</div>
	);
};
export default TopInfoBar;
