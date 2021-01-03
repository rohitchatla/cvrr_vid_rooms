const socket = io("/");
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

document.querySelector("#button").onclick = function () {
  console.log("started");
  var text = "";
  var score = "";
  //http://localhost:3002/api/speech-to-text/token
  fetch("https://s2twatibm.herokuapp.com/api/speech-to-text/token")//https://s2twatibm.herokuapp.com/api/speech-to-text/token
    .then(function (response) {
      return response.json();
    })
    .then(function (token) {
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone(
        Object.assign(token, {
          objectMode: true, // send objects instead of text
          format: false, // optional - performs basic formatting on the results such as capitals an periods
        })
      );

      stream.on("data", function (data) {
        //console.log(data);
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
        }
      });

      stream.on("error", function (err) {
        console.log(err);
      });

      document.querySelector("#stop").onclick = function () {
        console.log("stopped");
        stream.stop.bind(stream);
        var rno = Math.random() * 1000;
        var title = "titleeg" + rno.toString();
        postNote(title, "test@gmail.com", text, score);
        //console.log(text, score);
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};

async function getSummarizedText(email, text) {
  const body = { email, text };
  //http://standnote.herokuapp.com
  //http://127.0.0.1:8000/summarizer/
  const res = await fetch("https://cvrrvidnotes.herokuapp.com/summarizer/", {//https://cvrrvidnotes.herokuapp.com/summarizer/
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return data;
}

async function postNote(title, email, content, score) {
  const data = await getSummarizedText(email, title);
  //console.log(data);
  const body = {
    email,
    duration: "200", //meetingDuration,
    title,
    content, //: meetingText,
    markdown: data.summerised_text,
    score, //: window.confidenceScore,
  };
  //http://standnote.herokuapp.com
  //http://127.0.0.1:8000/notes/
  const res = await fetch("https://cvrrvidnotes.herokuapp.com/notes/", {//https://cvrrvidnotes.herokuapp.com/notes/
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  //console.log(res);
}

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on("call", (call) => {
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
      $("ul").append(
        `<li class="message"><small><b>Rocket-${p.uid}</b></small><br/>${p.message}</li>`
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
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

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
