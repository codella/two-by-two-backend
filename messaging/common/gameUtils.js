const Card = require("../../models/card");

/**
 * Borrowing an implementation of the Fisher-Yate shuffle.
 *
 * See: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffle(toShuffle) {
  const shuffled = [...toShuffle];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creating a 4x4 board.
 */
const createBoard = size => {
  if (size !== 2 && size !== 4) {
    // 2x2 boards make only sense to test the game through and through
    throw Error("only 2x2 and 4x4 boards are allowed");
  }
  // some card types, sufficient for building 2x2 and 4x4 boards
  const cardTypes = ["red", "silver", "black", "olive", "lime", "blue", "orange", "teal"];
  // picking only the types needed to build the board
  const numberOfCardsNeeded = (size * size) / 2;
  const cardTypesToUse = cardTypes.slice(0, numberOfCardsNeeded);
  // creating the card set of (size x size) pieces by doubling the cart types
  const cardsForTheBoard = [...cardTypesToUse, ...cardTypesToUse];
  // shuffling the card set
  const shuffled = shuffle(cardsForTheBoard);
  // laying the shuffled cards un the board
  const board = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cardType = shuffled[row * size + col];
      board.push(new Card(row, col, cardType, false /* not flipped */));
    }
  }

  return board;
};

/**
 * Randomply pick an element from an array.
 */
const pickRandomPlayer = players => players[Math.floor(Math.random() * players.length)];

/**
 * Given a player, fill find the next in turn.
 *
 * The order of the players in a game is consistent, so we can say that the next player
 * is the one at the next index in the array, or the first one if the curret player is
 * the last in the list.
 */
const findPlayerForNextTurn = (currentPlayer, allPlayersInGame) => {
  const currentPlayerIndex = allPlayersInGame.findIndex(player => player.id === currentPlayer.id);
  const isLastIndex = currentPlayerIndex === allPlayersInGame.length - 1;
  const nextIndex = isLastIndex ? 0 : currentPlayerIndex + 1;
  return allPlayersInGame[nextIndex];
};

/**
 * Filter in the cards that are flipped.
 */
const filterFlippedCards = board => board.filter(card => card.flipped);

/**
 * Enumerating the possible states a game can be in.
 */
const gameStates = {
  GAME_STATUS_WAITING_FOR_FIRST_FLIP: "GAME_STATUS_WAITING_FOR_FIRST_FLIP",
  GAME_STATUS_WAITING_FOR_SECOND_FLIP: "GAME_STATUS_WAITING_FOR_SECOND_FLIP",
  GAME_STATUS_FINISHED: "GAME_STATUS_FINISHED",
  GAME_STATUS_TURN_ENDED: "GAME_STATUS_TURN_ENDED"
};

/**
 * Static configuration, for debugging purpose.
 */
const BOARD_EDGE_LENGTH = 4;
const gameParameters = {
  BOARD_EDGE_LENGTH,
  TOTAL_CARDS_ON_THE_BOARD: BOARD_EDGE_LENGTH * BOARD_EDGE_LENGTH,
  FEEDBACK_DELAY_IN_MILLIS: 1800
};

module.exports = {
  filterFlippedCards,
  pickRandomPlayer,
  findPlayerForNextTurn,
  createBoard,
  gameStates,
  gameParameters
};
