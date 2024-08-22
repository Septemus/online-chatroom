import { Button } from "antd";
import { useState } from "react";
export default function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div className="counter">
			<Button
				onClick={() => {
					setCount(count + 1);
				}}
			>
				++count
			</Button>
			<p
				className="number"
				data-testid="count-number"
			>
				{count}
			</p>
		</div>
	);
}
