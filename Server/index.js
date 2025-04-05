const { Server } = require("socket.io");
const io = new Server(3000);

// this code will run when the client is connted to the server

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});
