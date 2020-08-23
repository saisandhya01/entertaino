//constants
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
const THREE_HOURS = 1000 * 60 * 60 * 3;
const {
  NODE_ENV = "development",
  SESS_NAME = "name",
  SESS_SECRET = "secret",
  SESS_LIFETIME = THREE_HOURS,
} = process.env;
const IN_PROD = NODE_ENV === "production";

//middlewares
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.static(__dirname + "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

//routes
app.use("/", require("./routes/index.js"));

const Game = require("./public/javascript/game");

http.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});

let waitingPlayer = null;
io.on("connection", (sock) => {
  console.log("A user connected");

  if (waitingPlayer) {
    new Game(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit("message", "Waiting for an opponent");
  }
});
