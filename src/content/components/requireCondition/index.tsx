import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import "./index.scss";
function RequireCondition({
	children,
	condition,
	loading,
	fallback = (
		<Navigate
			to="/login"
			replace
		/>
	),
}: {
	children: JSX.Element;
	fallback?: JSX.Element;
	condition: boolean;
	loading: boolean;
}) {
	let res: JSX.Element;
	if (loading) {
		res = (
			<div className="guard-wrapper">
				<Spin
					className="loading-spinner"
					size="large"
				/>
			</div>
		);
	} else {
		res = condition ? children : fallback;
	}
	return res;
}

export default RequireCondition;
