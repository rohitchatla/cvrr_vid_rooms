const express = require("express");
const app = express();
// const cors = require('cors')
// app.use(cors())
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const { v4: uuidV4 } = require("uuid");

app.use("/peerjs", peerServer);

app.set("view engine", "ejs");

app.use(express.static("views")); //for views folder as root for taking image logo or any static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("starting in server 24321142384724657146527485146527467");
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // messages
    socket.on("message", (message) => {
      //send message to the same room
      io.to(roomId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(process.env.PORT || 3030);
