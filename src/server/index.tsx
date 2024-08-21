import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { randomUUID } from 'crypto';
import App from '@/content/App';
import { WebSocketServer,WebSocket } from 'ws';
import { Note } from '@/types/message';
Object.assign(global, { WebSocket: require('ws') });

const PORT = process.env.PORT || 3006;
const app = express();

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(<App />);
  const indexFile = path.resolve('./build/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.use(express.static('./build'));

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
const connections=new Map<string,WebSocket>()
const wss = new WebSocketServer({ server });
wss.on("connection", function (ws) {    // what should a websocket do on connection
  console.log('connection!')
  const initNote=new Note('',randomUUID(),'init')
  connections.set(initNote.id,ws)
  setTimeout(()=>{
    ws.send(JSON.stringify(initNote))
  },1000)
  connections.forEach(function each(client,id) {
    if (id!==initNote.id&&client.readyState === WebSocket.OPEN) {     // check if client is ready
      client.send(JSON.stringify(new Note('someone has joined the gang!','admin','message')));
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