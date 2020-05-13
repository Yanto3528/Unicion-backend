const socketio = require("socket.io");
const User = require("./models/User");

let io;

exports.init = (server) => {
  io = socketio(server);
  io.on("connection", (socket) => {
    console.log("New connection!!");
    socket.on("online", async (id) => {
      const user = await User.findById(id);
      user.socketId = socket.id;
      await user.save();
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

exports.getIO = () => {
  if (!io) throw new Error("Socket io has not been initialized yet");
  return io;
};
