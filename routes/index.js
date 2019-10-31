const express = require("express");

const { configureCreateGameRoute } = require("./games/create");
const { configureJoinGameRoute } = require("./games/join");

/**
 * Configuring the API routes, passing them the needed dependencies.
 */
const configure = repositories => {
  const router = express.Router();

  router.use("/games", configureCreateGameRoute(repositories));
  router.use("/games", configureJoinGameRoute(repositories));

  return router;
};

module.exports = configure;
