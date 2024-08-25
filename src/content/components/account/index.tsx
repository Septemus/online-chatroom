import { useAppDispatch, useAppSelector } from "@/content/hooks/store";
import { selectId, setId } from "@/content/store/userSlice";

export default function Account() {
	const curid = useAppSelector((state) => selectId(state));
	console.log("curid:", curid);
	const dispatch = useAppDispatch();
	dispatch(setId("joe"));
	console.log("curid:", curid);
	return <div className="account">hello this is account page</div>;
}
