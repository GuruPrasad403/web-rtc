
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});
