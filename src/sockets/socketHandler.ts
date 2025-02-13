import { Server, Socket } from "socket.io";
import { rooms, roles } from "../utils/variables";

export default (io: Server): void => {
  io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, playerName }) => {
      if (!rooms[roomId] || rooms[roomId].started) {
        socket.emit('error', 'Room not available');
        return;
      }

      rooms[roomId].players.push({ id: socket.id, name: playerName });
      socket.join(roomId);
      io.to(roomId).emit('player-joined', rooms[roomId].players);

      if (rooms[roomId].players.length === 11) {
        rooms[roomId].started = true;
        const shuffledRoles = roles.sort(() => Math.random() - 0.5);
        rooms[roomId].players.forEach((player: any, index: number) => {
          player.role = shuffledRoles[index];
        });
        io.to(roomId).emit('roles-assigned', rooms[roomId].players);
      }
    });

    socket.on('disconnect', () => {
      for (const roomId in rooms) {
        rooms[roomId].players = rooms[roomId].players.filter((player: any) => player.id !== socket.id);
        io.to(roomId).emit('player-joined', rooms[roomId].players);
      }
    });
  });

};
