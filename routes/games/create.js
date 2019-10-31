const express = require("express");

const Event = require("../../models/event");
const { assert } = require("../common/errorHandling");

const configureCreateGameRoute = ({ gamesRepository, playersRepository, eventsRepository }) => {
  const router = express.Router();

  /**
   * Create a new game
   */
  router.post("/", function(req, res) {
    const { playerName } = req.body;

    console.info(`player with name '${playerName}' requested to create a new game`);

    assert(playerName, "You need to specify a name");

    // create a game and a player, binding them together
    const game = gamesRepository.create();
    const player = playersRepository.create(playerName, game.id);
    game.creatorId = player.id;

    // recording the related event
    eventsRepository.create(Event.GAME_CREATED, game.id, player.id);

    res.json({
      playerId: player.id,
      gameId: game.id
    });
  });

  return router;
};

module.exports = { configureCreateGameRoute };
