import { Navigate } from "react-router-dom";

function RequireCondition({
	children,
	condition,
}: {
	children: JSX.Element;
	condition: boolean;
}) {
	return condition ? (
		children
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
}

export default RequireCondition;
