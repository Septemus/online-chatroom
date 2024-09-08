import { Navigate } from "react-router-dom";

function RequireCondition({
	children,
	condition,
	loading,
}: {
	children: JSX.Element;
	condition: boolean;
	loading: boolean;
}) {
	if (loading) {
		return (
			<>
				<h1>loading</h1>
			</>
		);
	} else {
		return condition ? (
			children
		) : (
			<Navigate
				to="/login"
				replace
			/>
		);
	}
}

export default RequireCondition;
