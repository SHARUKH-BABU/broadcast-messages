const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cors = require("cors")

app.use(express.static("./public"));
app.use(cors({origin:"*"}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT, () => {
  console.log("Server running");
});

let onlineCount = 0;
io.on("connection", (socket) => {
//   console.log("User connected: " + socket.id);
  onlineCount++;
  io.emit("online-count", onlineCount);

  socket.on("user-msg", ({ name, msg }) => {
    socket.broadcast.emit("sendAll", { name, msg });
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected: " + socket.id);
    onlineCount--;
    io.emit("online-count", onlineCount);
  });

  // Emit a message when a new user joins
  io.emit("user-join", {
    name: "System",
    msg: "A new user has joined the chat",
  });
});