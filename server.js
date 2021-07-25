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

const nodemailer = require("nodemailer");

app.use("/peerjs", peerServer);

app.set("view engine", "ejs");

app.use(express.static("views")); //for views folder as root for taking image logo or any static file
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, 'public')));//for js files if needed just added now in advance(./scripts/js) & link those in ejs or write js script in b/w script tag only

app.get("/", (req, res) => {
  console.log("starting in server 2432114238472465714652748514652746700000");
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  // localStorage not defined
  // if (
  //   localStorage.getItem("email") &&
  //   localStorage.getItem("email") != "" &&
  //   localStorage.getItem("email") != "null" &&
  //   localStorage.getItem("email") != undefined
  // ) {
  //   let usernameid = p.uid; //${p.uid}
  // } else {
  //   let usernameid = localStorage
  //     .getItem("email")
  //     .substring(localStorage.getItem("email").indexOf("@")); //.substring(0, localStorage.getItem("email").indexOf("@") - 1);
  // }
  res.render("room", { roomId: req.params.room }); //, usernameid: usernameid
});

app.post("/mailoncall", (req, res) => {
  var data = req.body;
  data.email = "cvrrocket@gmail.com";
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: "cvrrocket@gmail.com",
      pass: "flyup@07cvrr",
    },
  });

  if (req.body.fileb64 != "") {
    var mailOptions = {
      from: data.email,
      replyto: data.email,
      to: data.to,
      subject: data.title,
      html: `<p>Title: ${data.title}</p>
    <p>Description: ${data.desc}</p>`,
      attachments: [
        {
          filename: data.title + ".jpg",
          contentType: "image/jpeg",
          content: new Buffer.from(
            req.body.fileb64.split("base64,")[1],
            "base64"
          ),
        },
      ],
    };
  } else {
    var mailOptions = {
      from: data.email,
      replyto: data.email,
      to: data.to,
      subject: data.title,
      html: `<p>${data.email}</p>
    <p>${data.desc}</p>`,
    };
  }

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send("Success");
    }
    smtpTransport.close();
  });
  res.send({ msg: "hii" });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    //localStorage.setItem("sid", userId);
    // messages
    socket.on("message", (message) => {
      //send message to the same room
      io.to(roomId).emit("createMessage", { message: message, uid: userId });
    });

    socket.on("filterchange", (filter) => {
      //send message to the same room
      socket.to(roomId).broadcast.emit("filtered", filter);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });

    // socket.on("screenShareA", (t) => {
    //   console.log(t);
    //   socket.emit("screenShareB", { type: "B" });
    // });
  });
});
//io.listen(3031);// 3030
server.listen(process.env.PORT || 3030);
