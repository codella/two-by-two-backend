const { withValidationErrorHandling } = require("./common/errorHandling");
const { createJoinHandler } = require("./games/createJoinHandler");
const { createBeginHandler } = require("./games/createBeginHandler");
const { createFlipCardHandler } = require("./games/createFlipCardHandler");

/**
 * Collecting the message handlers, giving them error handling capabilities
 */
module.exports = repositories => io => socket => ({
  join: withValidationErrorHandling(socket, createJoinHandler(repositories)(io, socket)),
  begin: withValidationErrorHandling(socket, createBeginHandler(repositories)(io, socket)),
  flipCard: withValidationErrorHandling(socket, createFlipCardHandler(repositories)(io, socket))
});
