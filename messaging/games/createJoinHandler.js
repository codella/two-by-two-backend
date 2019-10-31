const { roomByGameId } = require("../common/roomCreation");

const createJoinHandler = ({ playersRepository, eventsRepository }) => (io, socket) => ({
  socketIdToPlayerId,
  playerId,
  gameId
}) => {
  console.info(`player with id '${playerId}' connecting to game's room with id '${gameId}'`);

  // saving the relationship between sockets and playerIds
  socketIdToPlayerId[socket.id] = playerId;

  // joining the socket in the game room
  const room = roomByGameId(gameId);
  socket.join(room);

  // broadcasting to the game room that a new player has joined
  const players = playersRepository.findAllInGame(gameId);
  const playersNamesOnly = players.map(({ name }) => ({ name }));
  io.in(room).emit("UPDATE_GAME_JOINERS", { players: playersNamesOnly });
};

module.exports = { createJoinHandler };
