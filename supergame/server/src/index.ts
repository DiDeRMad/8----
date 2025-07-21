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
  moves: Record<string, Move>;
}

type Move = 'rock' | 'paper' | 'scissors';

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
    const room: Room = { id: roomId, players: { [socket.id]: player }, moves: {} };
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
    if (Object.keys(room.players).length > 2) {
      // room full, revert and notify
      delete room.players[socket.id];
      delete players[socket.id];
      delete playerRoom[socket.id];
      socket.leave(roomId);
      socket.emit('error', 'Room is full');
      return;
    }
    // after successful join, check if ready to start
    if (Object.keys(room.players).length === 2) {
      io.to(roomId).emit('game-start');
    }
  });

  socket.on('chat', (message: string) => {
    const roomId = playerRoom[socket.id];
    if (!roomId) return;
    const player = players[socket.id];
    io.to(roomId).emit('chat', { player, message });
  });

  socket.on('move', (move: Move) => {
    const roomId = playerRoom[socket.id];
    if (!roomId) return;
    const room = rooms[roomId];
    if (!room) return;
    room.moves[socket.id] = move;
    if (Object.keys(room.moves).length === Object.keys(room.players).length) {
      // evaluate round
      const playerIds = Object.keys(room.moves);
      if (playerIds.length !== 2) {
        // For now handle only 2-player comparison; reset moves
        room.moves = {};
        io.to(roomId).emit('round-result', { draw: true, info: 'Unsupported players count' });
        return;
      }
      const [p1, p2] = playerIds;
      const m1 = room.moves[p1];
      const m2 = room.moves[p2];

      let winnerId: string | null = null;
      if (m1 === m2) {
        winnerId = null; // Draw
      } else if ((m1 === 'rock' && m2 === 'scissors') || (m1 === 'scissors' && m2 === 'paper') || (m1 === 'paper' && m2 === 'rock')) {
        winnerId = p1;
      } else {
        winnerId = p2;
      }

      io.to(roomId).emit('round-result', {
        moves: room.moves,
        winnerId,
      });
      // reset moves for next round
      room.moves = {};
    }
  });

  socket.on('disconnect', () => {
    const roomId = playerRoom[socket.id];
    if (roomId) {
      const room = rooms[roomId];
      if (room) {
        delete room.players[socket.id];
        socket.to(roomId).emit('player-left-room', socket.id);
        if (Object.keys(room.players).length < 2) {
          io.to(roomId).emit('game-stop');
        }
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