import { renderHook } from "@testing-library/react";
import { useSocket } from ".";
import { Server } from "mock-socket";

const socketTestCase = async () => {
	const fakeURL = "ws://localhost:8080";
	const mockServer = new Server(fakeURL);
	mockServer.on("connection", (socket) => {
		console.log("mock server is connected");
	});
	const { result } = renderHook(() => {
		return useSocket(fakeURL);
	});
	const [socket, isReady] = result.current;
	setTimeout(() => {
		expect(isReady).toBe(true);
		socket.close();
		expect(isReady).toBe(false);
	}, 1000);
};
test("useSocket hook", socketTestCase);
