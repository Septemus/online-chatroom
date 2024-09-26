import { SocketNote } from "@/types/message";
import { randomUUID } from "crypto";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

export default function myCreateSocket(server: Server) {
	const connections = new Map<string, WebSocket>();
	const wss = new WebSocketServer({ server });
	wss.on("connection", function (ws) {
		// what should a websocket do on connection
		console.log("connection!");
		let mc_id = "";
		let target_id = "";

		ws.on("message", function (ori: Buffer) {
			let note: SocketNote = JSON.parse(ori.toString());
			console.log("message reached server!", note);
			console.log("online users:", connections.keys());
			// what to do on message event
			if (note.type === "init") {
				mc_id = note.id;
				target_id = note.msg;
				connections.set(mc_id, ws);
			} else {
				const target = connections.get(target_id);
				ws.send(ori.toString());
				if (target?.readyState === WebSocket.OPEN) {
					target.send(ori.toString());
				}
			}
		});
	});
	return wss;
}
