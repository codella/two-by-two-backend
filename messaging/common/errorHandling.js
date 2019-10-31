/**
 * This represents a messaging validation error, caused by the client.
 */
class MessagingValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "MessagingValidationError";
  }
}

/**
 * Utility function decorator to send a `GAME_ERROR` message
 * back to the socket in case of exception.
 *
 * This utility works best in tandem with the `assert` helper below.
 */
const withValidationErrorHandling = (socket, fn) => (...args) => {
  try {
    fn(...args);
  } catch (error) {
    if (error.constructor.name === MessagingValidationError.constructor.name) {
      socket.emit("GAME_ERROR", { error: error.message, validation: true });
    } else {
      socket.emit("GAME_ERROR", { error: "internal server error" });
      console.error(error);
    }
  }
};

/**
 * If the `condition` is false, raise an exception with the given `message`.
 */
const assert = (condition, message) => {
  if (!condition) throw new MessagingValidationError(message);
};

module.exports = {
  withValidationErrorHandling,
  assert
};
