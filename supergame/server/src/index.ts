import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

interface Player {
  id: string;
  nickname: string;
}

const players: Record<string, Player> = {};

io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join', (nickname: string) => {
    players[socket.id] = { id: socket.id, nickname };
    socket.broadcast.emit('player-joined', players[socket.id]);
    socket.emit('joined', players[socket.id]);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    socket.broadcast.emit('player-left', socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SuperGame server listening on port ${PORT}`);
});