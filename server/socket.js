// socket.js

const { Server } = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle user joining a project room or individual chat
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a message to a group or individual
    socket.on("sendMessage", (message) => {
      const roomId = message.groupId || message.roomId; // Use either groupId or roomId
      const { content } = message;

      if (roomId) {
        io.to(roomId).emit("receiveMessage", message);
        console.log(`Message sent to room ${roomId}:`, content);
      } else {
        console.error("roomId is undefined. Message not sent.");
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = initializeSocket;
