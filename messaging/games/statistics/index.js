const Event = require("../../../models/event");

function calculateWinners(players, events) {
  const scoreByPlayerId = new Map();

  // counting the number of matches per player
  const matchingEvents = events
    .filter(event => event.type === Event.SECOND_CARD_FLIPPED)
    .filter(event => event.payload.turnMetadata.theSecondCardMatchesTheFirst);

  // counting the number of matches per playerId
  matchingEvents.forEach(({ playerId }) => {
    const numberOfMatchForPlayer = scoreByPlayerId.get(playerId) || 0;
    scoreByPlayerId.set(playerId, numberOfMatchForPlayer + 1);
  });

  // group players by their score, so we can detect if there is more than one player with the highest score
  const playersGroupedByScore = new Map();
  scoreByPlayerId.forEach((score, playerId) => {
    const playersWithGivenScore = playersGroupedByScore.get(score) || [];
    playersGroupedByScore.set(score, [...playersWithGivenScore, playerId]);
  });

  // determining the winning player(s)
  const highestScore = Math.max(...playersGroupedByScore.keys());
  const winnersIds = playersGroupedByScore.get(highestScore);

  // resolving their ids to their name
  const winnerNames = winnersIds.map(winnerId => {
    const player = players.find(player => player.id === winnerId);
    return player.name;
  });

  return winnerNames;
}

module.exports = {
  calculateWinners
};
