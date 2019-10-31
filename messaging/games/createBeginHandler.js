const Event = require("../../models/event");

const { assert } = require("../common/errorHandling");
const { roomByGameId } = require("../common/roomCreation");
const {
  filterFlippedCards,
  pickRandomPlayer,
  createBoard,
  gameStates: { GAME_STATUS_WAITING_FOR_FIRST_FLIP },
  gameParameters: { BOARD_EDGE_LENGTH }
} = require("../common/gameUtils");

const createBeginHandler = ({ gamesRepository, playersRepository, eventsRepository }) => (io, socket) => ({
  socketIdToPlayerId
}) => {
  const playerId = socketIdToPlayerId[socket.id];

  console.info(`player with id '${playerId}' asked to begin the game`);

  assert(playerId, "You must specify a `playerId`");

  const game = gamesRepository.findByCreatorId(playerId);
  assert(game, "You haven't created any game yet");
  const players = playersRepository.findAllInGame(game.id);
  assert(players.length > 1, "You need to wait for at least another player to join");

  // creating the board for the game
  const board = createBoard(BOARD_EDGE_LENGTH);
  game.board = board;

  const playerOnTurn = pickRandomPlayer(players);
  game.playerOnTurn = playerOnTurn;
  game.state = GAME_STATUS_WAITING_FOR_FIRST_FLIP;

  // recording the related event
  eventsRepository.create(Event.GAME_UPDATED, game.id, playerId, {
    playerOnTurn,
    board,
    boardSize: BOARD_EDGE_LENGTH,
    gameState: game.state,
    turnMetadata: game.turnMetadata
  });

  // the players will only know what cards have been flipped, otherwise they can cheat.
  const room = roomByGameId(game.id);
  io.in(room).emit("GAME_UPDATED", {
    playerOnTurn: playerOnTurn,
    board: filterFlippedCards(board),
    boardSize: BOARD_EDGE_LENGTH,
    gameState: game.state,
    turnMetadata: game.turnMetadata
  });
};

module.exports = { createBeginHandler };
