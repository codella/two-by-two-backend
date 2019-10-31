/**
 * This represents an API validation error, caused by the client.
 */
class APIValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIValidationError";
  }
}

/**
 * If the `condition` is false, raise an exception with the given `message`.
 */
const assert = (condition, message) => {
  if (!condition) {
    const validationError = new APIValidationError(message);
    validationError.status = 422;
    throw validationError;
  }
};

module.exports = {
  assert
};
