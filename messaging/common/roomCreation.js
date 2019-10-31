/**
 * Generated a `room name` from a `gameId`.
 */
const roomByGameId = gameId => `/games/${gameId}`;

module.exports = { roomByGameId };
