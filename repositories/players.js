const Player = require("../models/player");
const uuidv4 = require("uuid/v4");

/**
 * Repository to access the players.
 */
class PlayersRepository {
  constructor(db) {
    this.db = db;
    this.db.players = [];
  }

  create(playerName, gameId) {
    const player = new Player(uuidv4(), playerName, gameId);
    this.db.players.push(player);
    return player;
  }

  find(playerId) {
    return this.db.players.find(player => player.id === playerId);
  }

  findAllInGame(gameId) {
    return this.db.players.filter(player => player.gameId === gameId);
  }
}

module.exports = PlayersRepository;
