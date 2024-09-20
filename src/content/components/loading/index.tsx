import { Spin } from "antd";
import "./index.scss";
export default function Loading() {
	return (
		<div className="loading-wrapper">
			<Spin
				className="loading-spinner"
				size="large"
			/>
		</div>
	);
}
