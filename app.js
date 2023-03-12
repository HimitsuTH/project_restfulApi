const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("module-alias/register");

const app = express();

const config = require("@config/index");

//MiddleWare
const errorHandler = require("@middleware/errorHandler");

// mongoose setting
const mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Routes
const indexRouter = require("@routes/index");
const headphoneRouter = require("@routes/headphone");
const shopRouter = require("@routes/shops");
const userRouter = require("@routes/user");

//not used
// const brandRouter = require("./routes/brand")

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/headphone", headphoneRouter);
app.use("/shop", shopRouter);

// not used
// app.use("/brand", brandRouter);
app.use("/user", userRouter);

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res.send("404 not found!!!").status(404);
});

app.use(errorHandler);

module.exports = app;
