import { useRef } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
type styleType = {
	[attr: string]: string | number;
};
export const TransitionWrapper: React.FC<{
	inProp: boolean;
	duration?: number;
	delay?: number;
	children: JSX.Element;
	style?: styleType;
	transitionMap: Partial<Record<TransitionStatus, styleType>>;
}> = ({
	inProp,
	children,
	duration = 500,
	style = {
		transition: `all ${duration}ms ease-in-out`,
		overflow: "hidden",
	},
	transitionMap,
	delay = 200,
}) => {
	const nodeRef = useRef(null);
	return (
		<Transition
			nodeRef={nodeRef}
			in={inProp}
			timeout={delay}
		>
			{(state) => (
				<div
					ref={nodeRef}
					style={{
						...style,
						...transitionMap[state],
					}}
				>
					{children}
				</div>
			)}
		</Transition>
	);
};
