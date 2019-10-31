const Event = require("../../../models/event");
const { roomByGameId } = require("../../common/roomCreation");

const {
  filterFlippedCards,
  gameParameters: { BOARD_EDGE_LENGTH },
  gameStates: { GAME_STATUS_WAITING_FOR_SECOND_FLIP }
} = require("../../common/gameUtils");

/**
 * The player is on their turn, and are flipping their first card.
 */
function handleFirstFlip({ card: firstFlippedCard, game, player, eventsRepository, io }) {
  console.info(`handling the first flip for player '${player.id}'`);

  // flip the card
  firstFlippedCard.flipped = true;
  // keeping track of the flipped card
  game.turnMetadata.firstFlippedCard = firstFlippedCard;
  // next status will be awaiting for the second flip to occur
  game.state = GAME_STATUS_WAITING_FOR_SECOND_FLIP;
  // recording the related event
  eventsRepository.create(Event.FIRST_CARD_FLIPPED, game.id, player.id, {
    playerOnTurn: game.playerOnTurn,
    board: game.board,
    flippedCard: firstFlippedCard
  });
  // the players will only know what cards have been flipped, otherwise they can cheat.
  const room = roomByGameId(game.id);
  io.in(room).emit("GAME_UPDATED", {
    playerOnTurn: game.playerOnTurn,
    boardSize: BOARD_EDGE_LENGTH,
    board: filterFlippedCards(game.board),
    gameState: game.state,
    turnMetadata: game.turnMetadata
  });
}

module.exports = { handleFirstFlip };
