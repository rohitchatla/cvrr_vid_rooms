import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import recognizeMic from "watson-speech/speech-to-text/recognize-microphone";
//import WatsonSpeech from "./watson-speech.js";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  onListenClick() {
    fetch("http://localhost:3002/api/speech-to-text/token")
      .then(function (response) {
        //console.log(JSON.stringify(response));
        return response.text();
      })
      .then((token) => {
        console.log("token is", token);
        console.log("token is", JSON.parse(token));
        let tokenn = JSON.parse(token);
        var stream = recognizeMic({
          //token:token,
          token: tokenn.accessToken,
          url: tokenn.url,
          objectMode: true, // send objects instead of text
          extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
          format: false, // optional - performs basic formatting on the results such as capitals an periods
        });
        console.log(stream);
        stream.on("data", (data) => {
          console.log(data);
          this.setState({
            text: data.alternatives[0].transcript,
          });
        });
        stream.on("error", function (err) {
          console.log(err);
        });

        document.querySelector("#stop").onclick = stream.stop.bind(stream);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.onListenClick.bind(this)}>
          Listen to microphone
        </button>
        <div style={{ fontSize: "40px" }}>{this.state.text}</div>
      </div>
    );
  }
}

export default App;
