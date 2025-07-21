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

interface Room {
  id: string;
  players: Record<string, Player>;
}

const rooms: Record<string, Room> = {};
const playerRoom: Record<string, string> = {}; // socket.id -> roomId

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.removeAllListeners('connection');
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('create-room', (nickname: string) => {
    const roomId = generateRoomId();
    const player: Player = { id: socket.id, nickname };
    players[socket.id] = player;
    const room: Room = { id: roomId, players: { [socket.id]: player } };
    rooms[roomId] = room;
    playerRoom[socket.id] = roomId;
    socket.join(roomId);
    socket.emit('room-created', { roomId, players: Object.values(room.players) });
    console.log(`Room ${roomId} created by ${nickname}`);
  });

  socket.on('join-room', ({ roomId, nickname }: { roomId: string; nickname: string }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    const player: Player = { id: socket.id, nickname };
    players[socket.id] = player;
    room.players[socket.id] = player;
    playerRoom[socket.id] = roomId;
    socket.join(roomId);
    socket.emit('room-joined', { roomId, players: Object.values(room.players) });
    socket.to(roomId).emit('player-joined-room', player);
    console.log(`${nickname} joined room ${roomId}`);
  });

  socket.on('chat', (message: string) => {
    const roomId = playerRoom[socket.id];
    if (!roomId) return;
    const player = players[socket.id];
    io.to(roomId).emit('chat', { player, message });
  });

  socket.on('disconnect', () => {
    const roomId = playerRoom[socket.id];
    if (roomId) {
      const room = rooms[roomId];
      if (room) {
        delete room.players[socket.id];
        socket.to(roomId).emit('player-left-room', socket.id);
        if (Object.keys(room.players).length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }
      delete playerRoom[socket.id];
    }
    delete players[socket.id];
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`SuperGame server listening on port ${PORT}`);
});