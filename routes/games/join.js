const express = require("express");

const Event = require("../../models/event");
const { assert } = require("../common/errorHandling");

const configureJoinGameRoute = ({ gamesRepository, playersRepository, eventsRepository }) => {
  const router = express.Router();

  /**
   * Join an existing game
   */
  router.put("/:gameId", (req, res) => {
    const { playerName } = req.body;
    const { gameId } = req.params;

    console.info(`player with name '${playerName}' requested to join the game with id '${gameId}'`);

    assert(playerName, "You need to specify a name");

    const game = gamesRepository.find(gameId);
    assert(game, "Game ID must refer to an existing game");

    // creating a player for the joiner
    const player = playersRepository.create(playerName, game.id);

    // recording the related event
    eventsRepository.create(Event.GAME_JOINED, game.id, player.id);

    res.json({
      playerId: player.id
    });
  });

  router.put("/", () => {
    assert(false, "You need to specify the Game ID to join");
  });

  return router;
};

module.exports = { configureJoinGameRoute };
