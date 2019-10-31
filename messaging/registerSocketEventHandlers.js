const messaging = require("./");
const socketIdToPlayerId = {};

/**
 * Configuring the message handlers, passing them the needed dependencies.
 */
const registerSocketEventHandlers = ({ gamesRepository, playersRepository, eventsRepository }) => io => socket => {
  const handler = messaging({ gamesRepository, playersRepository, eventsRepository })(io)(socket);

  socket.on("JOIN", payload => handler.join({ ...payload, socketIdToPlayerId }));
  socket.on("BEGIN", payload => handler.begin({ ...payload, socketIdToPlayerId }));
  socket.on("FLIP_CARD", payload => handler.flipCard({ ...payload, socketIdToPlayerId }));
};

module.exports = registerSocketEventHandlers;
