const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");
const { title } = require("process");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let player = {};
let currentPlayer = "W";
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", (uniqueSocket) => {
  // uniqueSocket is a unique value of user
  console.log("connected");

  uniqueSocket.on("Ram", () => {
    console.log("Jai shree Ram");
  });
});
server.listen(3000, () => {
  console.log(`Server is running on Port:3000`);
});
