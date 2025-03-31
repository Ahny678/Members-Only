var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sequelize = require("./config/database");
const messageModel = require("./models/message");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var messagesRouter = require("./routes/messages");

var app = express();
//PG POOL FOR SESSION CONFIG SINCE WE CANT USE SEQELEIZE BUT ONLY THE PG CLIENT DIRECTLY
const { Pool } = require("pg");
const pgPool = new Pool({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
// DB_NAME=MembersOnly
// DB_USERNAME=tiffany
// DB_PORT=5432
// DB_DIALECT=postgres
//-------------------------------------------------------------------------------------
//SESSION CODE-----------------------
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session); // PostgreSQL session store

const sessionStore = new PgSession({
  pool: pgPool,
  tableName: "session", // This will be the table in which sessions are stored
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//-------------------------------------

//PASSPORT SECTION---------------------------------------
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//  // console.log("CURRENT USER:", req.user);
//   //console.log("Session ID from cookie:", req.sessionID);
//   //console.log("Session object:", req.session);
//   next();
// });

//----------------------------------------------------

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

(async () => {
  try {
    await sequelize.authenticate();
    sequelize
      .sync({ alter: true })
      .then(() => console.log("> Database & tables created!"))
      .catch((err) => console.error("> Error syncing database:", err));

    console.log("> Database connected successfully!");
  } catch (error) {
    console.error("> Database connection error:", error);
  }
})();

module.exports = app;
