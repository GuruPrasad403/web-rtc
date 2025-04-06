const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const emailToSocketIDMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);
  socket.on("join-room", (data) => {
    const { emailId, roomCode } = data;
    emailToSocketIDMap.set(emailId, socket.id);
    socketIdToEmailMap.set(socket.id, emailId);
    socket.join(roomCode);
    io.to(roomCode).emit("user-joined", { emailId, id: socket.id });
    io.to(socket.id).emit("joined-room", { emailId, roomCode });
  });

  socket.on("call-user", (data) => {
    const { to, offer } = data;
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });
  socket.on("call-accepted", (data) => {
    const { to, ans } = data;
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  });
  socket.on("nego-tiation-needed", (data) => {
    const { to, offer } = data;
    io.to(to).emit("nego-tiation-needed", { from: socket.id, offer });
  });
  socket.on("nego-tiation-done", (data) => {
    const { to, ans } = data;
    io.to(to).emit("nego-tiation-final", { from: socket.id, ans });
  });
});

// check for the route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
