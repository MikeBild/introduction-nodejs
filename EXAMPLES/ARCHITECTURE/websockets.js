/*
const express = require('express');
const app = express();
const socketio = require('socket.io')
const webserver = app.listen(3000, () => console.log('Listen on 3000'));
const io = socketio.listen(webserver);

io.sockets.on('connection', client => {
    console.log('Server - new consumer connection');
    client.emit('message', { message: 'Welcome consumer' });
    client.on('send', data => {
      io.sockets.emit('message', data);
    });
    client.on('disconnect', () => {
      console.log('Server - consumer disconnect');
    });
});

const socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
  console.log('Client - consumer connected');
});
socket.on('message', data => {
  console.log('Client - consumer `message` event received: ', data);
});
socket.on('disconnect', () => {
  console.log('Client - consumer disconnected');
});

socket.emit('send', {msg: 'foo bar 1'});
socket.emit('send', {msg: 'foo bar 2'});
setTimeout(() => socket.disconnect(), 2000);
*/

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
