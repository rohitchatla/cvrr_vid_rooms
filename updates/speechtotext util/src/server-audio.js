"use strict";
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const fs = require("fs");

const speechToText = new SpeechToTextV1({
  // See: https://github.com/watson-developer-cloud/node-sdk#authentication
  authenticator: new IamAuthenticator({
    apikey: "nE6fu45CjJIy4rZszExjhDWQ3nQ35FJ-J3TitVujkO8f",
  }),
  serviceUrl: "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com",
  disableSslVerification: true,
});

/*
    This code will print the entire response to the console when it
    receives the 'data' event. Some applications will want to write
    out only the transcribed text, to the console or to a file.
    To do this, remove `objectMode: true` from the `params` object.
    Then, uncomment the block of code at Line 30.
*/
const params = {
  objectMode: true,
  contentType: "audio/mp3",
  model: "en-US_BroadbandModel",
  keywords: ["colorado", "tornado", "tornadoes"],
  keywordsThreshold: 0.5,
  maxAlternatives: 3,
};

// create the stream
const recognizeStream = speechToText.recognizeUsingWebSocket(params);

// pipe in some audio
fs.createReadStream(__dirname + "/test.mp3").pipe(recognizeStream);

/*
// these two lines of code will only work if `objectMode` is `false`
// pipe out the transcription to a file
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));
// get strings instead of Buffers from `data` events
recognizeStream.setEncoding('utf8');
*/

recognizeStream.on("data", function (event) {
  onEvent("Data:", event);
});
recognizeStream.on("error", function (event) {
  //onEvent("Error:", event);
});
recognizeStream.on("close", function (event) {
  //onEvent("Close:", event);
});

// Displays events on the console.
function onEvent(name, event) {
  console.log(
    name,
    JSON.stringify(event, null, 2) //event.results[0].alternatives[0].transcript
  );
}

// speechToText
//   .listModels()
//   .then((speechModels) => {
//     console.log(JSON.stringify(speechModels, null, 2));
//   })
//   .catch((err) => {
//     console.log("error:", err);
//   });

// or streaming
// fs.createReadStream("./resources/speech.wav")
//   .pipe(
//     speechToText.recognizeUsingWebSocket({
//       contentType: "audio/l16; rate=44100",
//     })
//   )
//   .pipe(fs.createWriteStream("./transcription.txt"));
