import { useEffect, useRef, useState } from "react";

export function useSocket(url: string): [WebSocket, boolean] {
	const ws = useRef<null | WebSocket>(null);
	const [isReady, setIsReady] = useState(false);
	useEffect(() => {
		// Establishing a WebSocket connection
		// Event listener for connection open
		const socket = new WebSocket(url);
		socket.onopen = () => {
			console.log("WebSocket connection established.");
			setIsReady(true);
		};
		socket.onclose = () => {
			console.log("Websocket connection closed.");
			setIsReady(false);
		};
		socket.onerror = (err) => {
			console.log("Websocket connection error.", err);
			setIsReady(false);
		};
		ws.current = socket;
		// Cleanup function to close the socket on component unmount
		return () => {
			setIsReady(false);
			(socket as WebSocket).close();
		};
	}, []);
	return [ws.current as WebSocket, isReady];
}
