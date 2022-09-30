const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

//security practices
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// const hpp = require("hpp");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorHandler");
const userRoutes = require("./routes/userRoutes");
const pokemonRoutes = require("./routes/PokemonRoutes");

const app = express();

dotenv.config({ path: `${__dirname}/config.env` });

app.use(express.json({ limit: "25kb" }));

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(xss());
app.use(mongoSanitize());
app.use("/api", apiLimiter);

app.use("/", userRoutes);
app.use("/", pokemonRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Could'nt find ${req.originalUrl} on this server`, 404));
});

//Error handler
app.use(globalErrorHandler);

module.exports = app;
