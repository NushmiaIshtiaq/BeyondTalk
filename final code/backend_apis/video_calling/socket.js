const io = require("socket.io");
const users = require("./users");

function initSocket(socket) {
  let id;
  socket
    .on("init", async (data) => {
      id = await users.create(socket, data.id);
      socket.emit("init", { id });
      console.log("Socket Created: ", id);
    })
    .on("request", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("request", { from: id });
      }
    })
    .on("call", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("call", { ...data, from: id });
      } else {
        socket.emit("failed");
      }
    })
    .on("end", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("end");
      }
    })
    .on("disconnect", () => {
      users.remove(id);
      console.log(id, "disconnected");
    });
}

module.exports = (server) => {
  io.listen(server, { log: true }).on("connection", initSocket);
};
