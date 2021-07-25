const socket = io("/"); // "/" <--> http://localhost:3030", "https://cvrrvidrooms.herokuapp.com/"
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});
let myVideoStream;
const myVideo = document.createElement("video");
myVideo.id = "myVideo";
myVideo.muted = true;
const peers = {};

const filter = document.querySelector("#filter");
let currentFilter;

async function boardactions() {
  //cvrrtodo
  const API_BASE_URL = "/api/v1";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjMwMmU5OTY1ZTJhZTAwMTcwNmY0ZDQiLCJpYXQiOjE2MDkyMzA1OTN9.UYOCQ7hi4sUWvz464w67g1UucaTgIAypq0tZnfcxmBI";
  const userId = "5f302e9965e2ae001706f4d4";
  try {
  } catch (error) {}
  let name = "";
  let background = "https://picsum.photos/id/488/200/200";
  const newBoard = { name, background };
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`, //localStorage.getItem("token")
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBoard),
  });

  const board = await response.json();
  console.log(board);
}

async function chataction() {
  //cvrrtchat
  let videourl = "";
  let photourl = "";
  let etcfileurl = "";
  let filetype = {
    filetypep: "",
    filetypev: "",
    filetypee: "",
  };
  let channelid = "";
  let authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmYjBkYWE1ODQwYzU3MTRiNDM3Y2Y3MCIsIm5hbWUiOiJ0ZXN0MTIzIn0sImlhdCI6MTYwOTY1NjgxNCwiZXhwIjoxNjA5NzQzMjE0LCJzdWIiOiJ0ZXN0MTIzIn0.igkyw2abCCkwoASmeDpiWWn4BNnKiDaZbY1e2swVMo4";
  let userId = "5fb0daa5840c5714b437cf70";

  await axios
    .post(
      "https://cvrrtchat.herokuapp.com/api/comments",
      //postData,
      {
        user: localStorage.userId,
        text: text,
        replyp: "",
        replypayload: "",
        forwardpayload: "",
        forward: "",
        replyfromid: "",
        forwardfromid: "",
        channelID: channelid, //appState.channel.id,
        photo: "",
        video: "",
        etcfile: "",
        filetype,
      },
      {
        headers: {
          authorization: `bearer ${localStorage.authToken}`,
          //'Content-Type': 'multipart/form-data', //'Content-Type': 'application/json',
          //Accept: 'application/json',
        },
      }
    )
    .then(() => {
      dispatch({ type: "POST_TO_DB", text });
      //resetLocalStorage();
    })
    .catch((err) => console.error(err));
}

// const setupReader = (filee) => {
//   let reader = new FileReader();
//   reader.readAsDataURL(filee);
//   reader.onload = function () {
//     //console.log(reader.result);
//     setInitialImageBase64(reader.result);
//   };
//   reader.onerror = function (error) {
//     console.log("Error: ", error);
//   };
// };

{/* <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  setFile(e.target.files[0]);
                  setupReader(e.target.files[0]);
                }}
              /> */}

document.querySelector("#button").onclick = function () {
  console.log("started");

  login(); //for cvrrvidnotes authentication and(&) authorization(auth&auth)

  var text = "";
  var score = 0;
  var duration = 0;
  var stop = 0;
  var pause = 0;
  //http://localhost:3002/api/speech-to-text/token
  fetch("https://s2twatibm.herokuapp.com/api/speech-to-text/token") //https://s2twatibm.herokuapp.com/api/speech-to-text/token
    .then(function (response) {
      return response.json();
    })
    .then(function (token) {
      console.log(token);
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone(
        Object.assign(token, {
          objectMode: true, // send objects instead of text
          format: false, // optional - performs basic formatting on the results such as capitals an periods
        })
      );

      stream.on("data", function (data) {
        //console.log(data);
        if (stop == 0 && pause == 0) {
          duration++;
          var conf = data.results[data.results.length - 1].alternatives[0]
            .confidence
            ? data.results[data.results.length - 1].alternatives[0].confidence
            : 0; //0th has more confidence and sometimes confidence attribute doesnt come at all in any also
          if (conf && conf > 0.37) {
            //conf && conf > 0.47
            transcript =
              data.results[data.results.length - 1].alternatives[0].transcript;
            if (score == 0) {
              score = Math.max(score, conf);
            } else {
              score = (score + conf) / 2;
            }
            text += transcript;
            console.log(text);

            /*Classes oncall with names,test imp points */
            if (
              transcript == "chatla" ||
              transcript == "venkat" ||
              transcript == "rohit" ||
              transcript == "exam assignment" ||
              transcript == "cia"
            ) {

    //           await axios
    // .post(
    //   "https://cvrrvidrooms.herokuapp.com/mailoncall",
    //   {
    //     to: "rohitchatla@gmail.com",
    //     title: transcript,
    //     desc: text,
    //     fileb64: '',//attachments(if_any)
    //   },
    //   {
    //     headers: {
    //       authorization: `bearer ${localStorage.authToken}`,
    //       //'Content-Type': 'multipart/form-data', //'Content-Type': 'application/json',
    //       //Accept: 'application/json',
    //     },
    //   }
    // )
    // .then(() => {
    // })
    // .catch((err) => console.error(err));
    //         fetch("https://cvrrvidrooms.herokuapp.com/mailoncall")
    // .then(function (response) {
    //   return response.json();
    // })
    // .then(function (token) {})

    const body={
        to: "rohitchatla@gmail.com",
        title: transcript,
        desc: text,
        fileb64: '',//attachments(if_any)
    }

    const response = await fetch(`https://cvrrvidrooms.herokuapp.com/mailoncall`, {
      method: "POST",
      headers: {
        //authorization: `Bearer ${token}`, //localStorage.getItem("token")
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    const oncall = await response.json();
    console.log(oncall);
            }
          }
        }
      });

      stream.on("error", function (err) {
        console.log(err);
      });

      document.querySelector("#stop").onclick = function () {
        console.log("stopped");
        stream.stop.bind(stream);
        stop = 1; //can keep circular/loop to toggle to 0->1,1->0
        var rno = Math.random() * 1000;
        var title = "titleeg" + rno.toString();
        // let email = localStorage.getItem("email")
        // let title = prompt("Title")
        // localStorage.setItem("title",title)
        const newWindow = window.open("./textEditor.html");
        newWindow.text = text.replace("undefined", "");
        newWindow.email = localStorage.getItem("email"); //data.email;
        newWindow.duration = duration;
        newWindow.confidenceScore = (100 * score).toFixed(2);
        text = "";
        score = 0;
        duration = 0;
        //postNote(title, "test@gmail.com", text, score);
        //console.log(text, score);
      };

      document.querySelector("#pause").onclick = function () {
        //console.log("paused");
        if (pause == 0) {
          //circular/loop thing
          console.log("paused");
          pause = 1;
          document.querySelector("#pause").textContent = "play";
        } else {
          //pause==1
          console.log("play");
          pause = 0;
          document.querySelector("#pause").textContent = "pause";
        }
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};

function login() {
  //already logged in check,(or else),--> if not then login
  console.log(typeof localStorage.getItem("email")); //string for null too so use "null" like this in checking
  if (
    localStorage.getItem("email") &&
    localStorage.getItem("email") != "" &&
    localStorage.getItem("email") != "null" &&
    localStorage.getItem("email") != undefined
  ) {
    console.log("cc");
    console.log(localStorage.getItem("email"));
    console.log(
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@"))
    );
    document.querySelector("#logout").textContent =
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout";
    document.querySelector("#login").disabled = true;
  } else {
    let email = prompt("Enter email id");
    let password = prompt("Password");
    let username = prompt("Username");
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("username", username);
    //login();//can cause user not found error for quick meet(instant meet)
    console.log(localStorage.getItem("email"));
    console.log(
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@"))
    );
    document.querySelector("#logout").textContent =
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout"; //localStorage.getItem("username")+ " Logout";
    document.querySelector("#login").disabled = true;
  }

  const email = localStorage.getItem("email"),
    password = localStorage.getItem("password"),
    username = localStorage.getItem("username");

  //disableButtons();
  //http://127.0.0.1:8000/rest-auth/login/
  fetch("https://cvrrvidnotes.herokuapp.com/rest-auth/login/", {
    //https://cvrrvidnotes.herokuapp.com/
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      console.log(data);
      alert("Logged in successfull");
      // chrome.storage.sync.set({ key: data.key });
      // chrome.storage.sync.set({ email });
      //enableButtons();
      //showRecordScreen(email);
    })
    .catch((err) => {
      console.log(err);
      alert(err);
      //enableButtons();
    });
}

function nativelocallogincheck() {
  console.log(typeof localStorage.getItem("email")); //string for null too so use "null" like this in checking
  if (
    localStorage.getItem("email") &&
    localStorage.getItem("email") != "" &&
    localStorage.getItem("email") != "null" &&
    localStorage.getItem("email") != undefined
  ) {
    console.log("cc");
    console.log(localStorage.getItem("email"));
    console.log(
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@"))
    );
    document.querySelector("#logout").textContent =
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout";
    document.querySelector("#login").disabled = true;
  } else {
    let email = prompt("Enter email id");
    let password = prompt("Password");
    let username = prompt("Username");
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("username", username);
    //login();//can cause user not found error for quick meet(instant meet)
    console.log(localStorage.getItem("email"));
    console.log(
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@"))
    );
    document.querySelector("#logout").textContent =
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout"; //localStorage.getItem("username")+ " Logout";
    document.querySelector("#login").disabled = true;
  }
}

document.querySelector("#logout").onclick = function () {
  console.log("logout");
  localStorage.setItem("email", "");
  localStorage.setItem("password", "");
  localStorage.setItem("username", "");
  //document.querySelector("#logout").disabled = true;
  document.querySelector("#logout").textContent =
    localStorage
      .getItem("email")
      .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout";
};

document.querySelector("#login").onclick = function () {
  console.log("login");
  if (
    localStorage.getItem("email") &&
    localStorage.getItem("email") != "" &&
    localStorage.getItem("email") != "null" &&
    localStorage.getItem("email") != undefined
  ) {
    console.log("cc");
    document.querySelector("#login").disabled = true;
  } else {
    let email = prompt("Enter email id");
    let password = prompt("Password");
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    //login();
    console.log(localStorage.getItem("email"));
    console.log(
      localStorage
        .getItem("email")
        .substring(localStorage.getItem("email").indexOf("@"))
    );
    document.querySelector("#logout").textContent =
      localStorage
        .getItem("email")
        .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout";
    document.querySelector("#login").disabled = true;
  }
};

document.querySelector("#change").onclick = function () {
  console.log("change settings");
  let newemail = prompt("New email");
  let newpassword = prompt("New email");
  let newusername = prompt("New email");
  localStorage.setItem("email", newemail);
  localStorage.setItem("password", newpassword);
  localStorage.setItem("username", newusername);
};

// async function getSummarizedText(email, text) {//in textEditor.js
//   const body = { email, text };
//   //http://127.0.0.1:8000/summarizer/
//   const res = await fetch("https://cvrrvidnotes.herokuapp.com/summarizer/", {
//     //https://cvrrvidnotes.herokuapp.com/summarizer/
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();

//   return data;
// }

// async function postNote(title, email, content, score) {//in textEditor.js
//   const data = await getSummarizedText(email, title);
//   //console.log(data);
//   const body = {
//     email,
//     duration: "200", //meetingDuration,
//     title,
//     content, //: meetingText,
//     markdown: data.summerised_text,
//     score, //: window.confidenceScore,
//   };
//   //http://127.0.0.1:8000/notes/
//   const res = await fetch("https://cvrrvidnotes.herokuapp.com/notes/", {
//     //https://cvrrvidnotes.herokuapp.com/notes/
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   //console.log(res);
// }

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log("connected");
    console.log(typeof localStorage.getItem("email")); //string for null too so use "null" like this in checking
    if (
      localStorage.getItem("email") &&
      localStorage.getItem("email") != "" &&
      localStorage.getItem("email") != "null" &&
      localStorage.getItem("email") != undefined
    ) {
      console.log("cc");
      console.log(localStorage.getItem("email"));
      console.log(
        localStorage
          .getItem("email")
          .substring(0, localStorage.getItem("email").indexOf("@"))
      );
      document.querySelector("#logout").textContent =
        localStorage
          .getItem("email")
          .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout";
      document.querySelector("#login").disabled = true;
    } else {
      let email = prompt("Enter email id");
      let password = prompt("Password");
      let username = prompt("Username");
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("username", username);
      //login();//can cause user not found error for quick meet(instant meet)
      console.log(localStorage.getItem("email"));
      console.log(
        localStorage
          .getItem("email")
          .substring(0, localStorage.getItem("email").indexOf("@"))
      );
      document.querySelector("#logout").textContent =
        localStorage
          .getItem("email")
          .substring(0, localStorage.getItem("email").indexOf("@")) + " Logout"; //localStorage.getItem("username")+ " Logout";
      document.querySelector("#login").disabled = true;
    }

    addVideoStream(myVideo, stream);
    myPeer.on("call", (call) => {
      //console.log("connected");
      call.answer(stream); //if call is going on then add admin to your setup as other member(among peers)
      const video = document.createElement("video");
      video.id = "peerVideo";
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // myPeer.on("data", function (data) {
    //   let decodedData = new TextDecoder("utf-8").decode(data);
    //   let peervideo = document.querySelector("#peerVideo");
    //   peervideo.style.filter = decodedData;
    // });

    socket.on("filtered", (filter) => {
      console.log(filter);
      let peervideo = document.querySelector("#peerVideo");
      peervideo.style.filter = filter;
    });

    filter.addEventListener("change", (event) => {
      currentFilter = event.target.value;
      myVideo.style.filter = currentFilter;
      SendFilter(currentFilter);
      event.preventDefault;
    });

    socket.on("user-connected", (userId) => {
      //console.log(userId);

      connectToNewUser(userId, stream);
      alert("A new Rocket launched : " + userId);
    });
    // input value
    let text = $("input");
    // when press enter send message
    $("html").keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });
    socket.on("createMessage", (p) => {
      let usernameid = p.uid;
      //console.log(usernameid);
      if (
        localStorage.getItem("email") &&
        localStorage.getItem("email") != "" &&
        localStorage.getItem("email") != "null" &&
        localStorage.getItem("email") != undefined
      ) {
        usernameid = p.uid; //${p.uid}
      } else {
        usernameid = localStorage
          .getItem("email")
          .substring(localStorage.getItem("email").indexOf("@")); //localStorage.getItem("username")

        /*localStorage
          .getItem("email")
          .substring(0, localStorage.getItem("email").indexOf("@") - 1); */
      }
      //console.log(usernameid);
      $("ul").append(
        `<li class="message"><small><b>Rocket-${usernameid}</b></small><br/>${p.message}</li>`
      );
      scrollToBottom();
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
    alert("A new Rocket mission done : " + userId);
  }
});

// socket.on("screenShareB", (t) => {
//   if (t.type == "B") {
//     console.log(t);
//     window.open("https://cvrr-share-screen.netlify.app/");
//   }
// });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id); //id here is userid
});

function SendFilter(filter) {
  console.log(filter);
  socket.emit("filterchange", filter);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video"); //adding this peer video to the owner's/admin's view
  video.id = "peerVideo";
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

const scrollToBottom = () => {
  var d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  //console.log(myVideoStream.getVideoTracks()[0]);
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    //myVideoStream.getVideoTracks()[0].stop();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

// // stop both mic and camera
// function stopBothVideoAndAudio(stream) {
//   stream.getTracks().forEach(function(track) {
//       if (track.readyState == 'live') {
//           track.stop();
//       }
//   });
// }

// // stop only camera
// function stopVideoOnly(stream) {
//   stream.getTracks().forEach(function(track) {
//       if (track.readyState == 'live' && track.kind === 'video') {
//           track.stop();
//       }
//   });
// }

// // stop only mic
// function stopAudioOnly(stream) {
//   stream.getTracks().forEach(function(track) {
//       if (track.readyState == 'live' && track.kind === 'audio') {
//           track.stop();
//       }
//   });
// }

// const screenShare = () => {
//   console.log("called");
//   socket.emit("screenshareA", { type: "A" });
//   window.open("https://cvrr-share-screen.netlify.app/");
// };

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
