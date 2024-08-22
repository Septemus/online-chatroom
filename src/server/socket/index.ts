import { Note } from "@/types/message";
import { randomUUID } from "crypto";
import { Server } from "http";
import { WebSocketServer,WebSocket } from "ws";

export default function myCreateSocket(server: Server) {
    const connections = new Map<string, WebSocket>()
    const wss = new WebSocketServer({ server });
    wss.on("connection", function (ws) {    // what should a websocket do on connection
        console.log('connection!')
        const initNote = new Note('', randomUUID(), 'init')
        connections.set(initNote.id, ws)
        setTimeout(() => {
            ws.send(JSON.stringify(initNote))
        }, 1000)
        connections.forEach(function each(client, id) {
            if (id !== initNote.id && client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(JSON.stringify(new Note('someone has joined the gang!', 'admin', 'message')));
            }
        })

        ws.on("message", function (msg) {        // what to do on message event

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                    client.send(msg.toString());
                }
            })
        })
    })
    return wss
}