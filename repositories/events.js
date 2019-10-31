const Event = require("../models/event");
const uuidv4 = require("uuid/v4");

/**
 * Repository to access the events.
 */
class EventsRepository {
  constructor(db) {
    this.db = db;
    this.db.events = [];
  }

  create(type, gameId, playerId, payload) {
    const event = new Event(uuidv4(), type, gameId, playerId, payload);
    this.db.events.push(event);
    return event;
  }

  findByGameId(gameId) {
    return this.db.events.filter(event => event.gameId === gameId);
  }
}

module.exports = EventsRepository;
