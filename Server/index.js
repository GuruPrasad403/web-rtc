
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const emailToSocketIDMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join-room", (data) => {
    const { emailId, roomCode } = data;
    emailToSocketIDMap.set(emailId, socket.id);
    socketIdToEmailMap.set(socket.id, emailId);
    io.to(socket.id).emit("joined-room", { emailId, roomCode });
  });
});
