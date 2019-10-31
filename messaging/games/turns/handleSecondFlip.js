const Event = require("../../../models/event");
const { roomByGameId } = require("../../common/roomCreation");

const { calculateWinners } = require("../statistics");

const {
  filterFlippedCards,
  findPlayerForNextTurn,
  gameParameters: { BOARD_EDGE_LENGTH, TOTAL_CARDS_ON_THE_BOARD, FEEDBACK_DELAY_IN_MILLIS },
  gameStates: { GAME_STATUS_WAITING_FOR_FIRST_FLIP, GAME_STATUS_TURN_ENDED, GAME_STATUS_FINISHED }
} = require("../../common/gameUtils");

/**
 * The player is on their turn, and are flipping their second card.
 */
function handleSecondFlip({ card: secondFlippedCard, game, player, allPlayersInGame, eventsRepository, io }) {
  console.info(`handling the second flip for player '${player.id}'`);

  // flip the card
  secondFlippedCard.flipped = true;
  const { turnMetadata, board } = game;
  // keeping track of the flipped card
  turnMetadata.secondFlippedCard = secondFlippedCard;

  // checking if the selected card matches the first
  const theSecondCardMatchesTheFirst = turnMetadata.firstFlippedCard.type === secondFlippedCard.type;
  turnMetadata.theSecondCardMatchesTheFirst = theSecondCardMatchesTheFirst;

  // check if the cards on the board are flipped
  const numberOfFlippedCards = board.filter(card => card.flipped).length;
  const areAllTheCardsFlipped = numberOfFlippedCards === TOTAL_CARDS_ON_THE_BOARD;
  if (areAllTheCardsFlipped) {
    game.state = GAME_STATUS_FINISHED;
  } else {
    // game is still on, we start the next turn
    game.state = GAME_STATUS_TURN_ENDED;
    // determining the next player on turn
    const nextPlayer = theSecondCardMatchesTheFirst
      ? game.playerOnTurn // the player matched the cards, so is awarded an extra turn
      : findPlayerForNextTurn(player, allPlayersInGame); // the player didn't get a match, so we figure out who's the next player
    // scheduling the turn to start with a delay, so the clients can see the cards flipped in the second turn
    setTimeout(() => signalNextTurn(game, io, nextPlayer), FEEDBACK_DELAY_IN_MILLIS);
  }

  // recording the related event
  eventsRepository.create(Event.SECOND_CARD_FLIPPED, game.id, player.id, {
    playerOnTurn: game.playerOnTurn,
    board: game.board,
    gameState: game.state,
    turnMetadata,
    flippedCard: secondFlippedCard,
    gameFinalStats: game.finalStats
  });

  // when the game is finished, we also want to report the statistics.
  // note that the statistics are calculated using reducers inspired by event sourcing.
  const history = eventsRepository.findByGameId(game.id);
  if (game.state === GAME_STATUS_FINISHED) {
    game.finalStats = {
      winners: calculateWinners(allPlayersInGame, history),
      history
    };
  }

  // broadcasting to the room the updated board
  const room = roomByGameId(game.id);
  io.in(room).emit("GAME_UPDATED", {
    playerOnTurn: game.playerOnTurn,
    board: filterFlippedCards(game.board),
    boardSize: BOARD_EDGE_LENGTH,
    gameState: game.state,
    turnMetadata: game.turnMetadata,
    flippedCard: secondFlippedCard,
    gameFinalStats: game.finalStats
  });
}

/**
 * Signaling a new turn.
 */
const signalNextTurn = (game, io, nextPlayer) => {
  // we need to signal the beginning of the next turn
  game.state = GAME_STATUS_WAITING_FOR_FIRST_FLIP;
  // finding the player next in turn
  game.playerOnTurn = nextPlayer;
  // no match, we unflip the cards
  const { theSecondCardMatchesTheFirst, firstFlippedCard, secondFlippedCard } = game.turnMetadata;
  if (!theSecondCardMatchesTheFirst) {
    firstFlippedCard.flipped = false;
    secondFlippedCard.flipped = false;
  }
  // turn metadata reset at the beginning of each turn
  game.turnMetadata = {};

  io.in(roomByGameId(game.id)).emit("GAME_UPDATED", {
    playerOnTurn: game.playerOnTurn,
    boardSize: BOARD_EDGE_LENGTH,
    board: filterFlippedCards(game.board),
    gameState: game.state,
    turnMetadata: game.turnMetadata
  });
};

module.exports = { handleSecondFlip };
