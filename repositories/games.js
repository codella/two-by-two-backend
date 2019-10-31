const Game = require("../models/game");
const uuidv4 = require("uuid/v4");

/**
 * Repository to access the games.
 */
class GamesRepository {
  constructor(db) {
    this.db = db;
    this.db.games = [];
  }

  create() {
    const game = new Game(uuidv4());
    this.db.games.push(game);
    return game;
  }

  find(gameId) {
    return this.db.games.find(game => game.id === gameId);
  }

  findByCreatorId(creatorId) {
    return this.db.games.find(game => game.creatorId === creatorId);
  }
}

module.exports = GamesRepository;
