const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

require("dotenv").config();

const authRouter = require("./api/auth");
const userRouter = require("./api/user");
const friendsRouter = require("./api/friends");
const newsRouter = require("./api/news");
const noticeRouter = require("./api/notices");

const app = express();

app
  .use(logger("dev"))
  .use(cors())
  .use(express.json())
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use("/api/auth", authRouter)
  .use("/api/user", userRouter)
  .use("/api/notices", noticeRouter)
  .use("/api/friends", friendsRouter)
  .use("/api/news", newsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error", errors } = err;
  res.status(status).json({ message, errors });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

mongoose.Promise = global.Promise;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
