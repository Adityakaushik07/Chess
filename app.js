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

  if (!player.white) {
    player.white = uniqueSocket.id;
    uniqueSocket.emit("plyerRole", "w");
  } else if (!player.black) {
    player.black = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "b");
  } else {
    uniqueSocket.emit("spectatorRole");
  }

  uniqueSocket.on("disconnect", () => {
    if (uniqueSocket.id === player.white) {
      delete player.white;
    } else if (uniqueSocket.id === player.black) {
      delete player.black;
    }
  });

  uniqueSocket.on("move",(move)=>{
    try {
      if(chess.turn()=== "w" && uniqueSocket.id !== player.white) return
      if(chess.turn()=== "b" && uniqueSocket.id !== player.black) return

      const result = chess.move(move)
      if (result) {
        currentPlayer = chess.turn()
        io.emit("move",move)
        io.emit("boardState", chess.fen())
      }
      else{
        console.log("Invalid Move : ", move)
        uniqueSocket.emit("invalidMove", move)
      }
      } catch (err) {
        console.log(err)
        uniqueSocket.emit("Invalid Move : ", move)
      
    }
  })

});
server.listen(3000, () => {
  console.log(`Server is running on Port:3000`);
});
