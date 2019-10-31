class Event {
  static GAME_CREATED = "GAME_CREATED";
  static GAME_JOINED = "GAME_JOINED";
  static GAME_UPDATED = "GAME_UPDATED";
  static FIRST_CARD_FLIPPED = "FIRST_CARD_FLIPPED";
  static SECOND_CARD_FLIPPED = "SECOND_CARD_FLIPPED";

  constructor(id, type, gameId, playerId, payload = {}) {
    this.id = id;
    this.type = type;
    this.gameId = gameId;
    this.playerId = playerId;
    this.payload = payload;
    this.timestamp = new Date() * 1;
  }
}

module.exports = Event;
