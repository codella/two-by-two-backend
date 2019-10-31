const { handleFirstFlip } = require("./turns/handleFirstFlip");
const { handleSecondFlip } = require("./turns/handleSecondFlip");

const { assert } = require("../common/errorHandling");

/**
 * Mapping each game state to its handler.
 */
const GAME_STATE_HANDLERS = {
  GAME_STATUS_WAITING_FOR_FIRST_FLIP: handleFirstFlip,
  GAME_STATUS_WAITING_FOR_SECOND_FLIP: handleSecondFlip,
  GAME_STATUS_TURN_ENDED: () => {}
};

const createFlipCardHandler = ({ gamesRepository, playersRepository, eventsRepository }) => (io, socket) => ({
  socketIdToPlayerId,
  row,
  col
}) => {
  const playerId = socketIdToPlayerId[socket.id];

  console.info(`player with id '${playerId}' asked to flip card at ${row}x${col}`);

  const player = playersRepository.find(playerId);
  assert(player, `Your playerId '${playerId}' does not exist`);

  const game = gamesRepository.find(player.gameId);
  assert(game, `You are not in any game`);
  assert(game.playerOnTurn.id === playerId, `it's not your turn`);

  const card = game.board.find(card => card.row === row && card.col === col);
  assert(!card.flipped, `Card '${row}x${col}' is already flipped`);

  const allPlayersInGame = playersRepository.findAllInGame(game.id);
  const stateHandler = GAME_STATE_HANDLERS[game.state];

  if (!stateHandler) {
    throw new Error(`Unknown game state: '${game.state}'`);
  }

  stateHandler({ card, game, player, allPlayersInGame, eventsRepository, io });
};

module.exports = { createFlipCardHandler };
