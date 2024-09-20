import { Navigate } from "react-router-dom";
import Loading from "../loading";
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
		res = <Loading />;
	} else {
		res = condition ? children : fallback;
	}
	return res;
}

export default RequireCondition;
