const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const routes = require("./routes");

function createApp(repositories) {
  const app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // configure the routes
  app.use("/", routes(repositories));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    const status = err.status || 500;
    // logging error 500 and unknown ones
    if (status === 500) {
      console.error(err);
    }
    res.status(err.status || 500).json({
      error: err.message
    });
  });

  return app;
}

module.exports = createApp;
