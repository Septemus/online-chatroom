import { Navigate } from "react-router-dom";

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
	if (loading) {
		return (
			<>
				<h1>loading</h1>
			</>
		);
	} else {
		return condition ? children : fallback;
	}
}

export default RequireCondition;
