"use strict";

const express = require("express");
const app = express();
const cors = require("cors");

const { IamTokenManager } = require("ibm-watson/auth");

// allows environment properties to be set in a file named .env
require("dotenv").config({ silent: true });

// if (!process.env.SPEECH_TO_TEXT_IAM_APIKEY) {
//   console.error(
//     "Missing required credentials - see https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials"
//   );
//   process.exit(1);
// }

// enable rate-limiting
// const RateLimit = require("express-rate-limit");
// app.enable("trust proxy"); // required to work properly behind Bluemix's reverse proxy

// const limiter = new RateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

// //  apply to /api/*
// app.use("/api/", limiter);

// // force https - microphone access requires https in Chrome and possibly other browsers
// // (*.mybluemix.net domains all have built-in https support)

// const secure = require("express-secure-only");
// app.use(secure());
app.use(express.static(__dirname + "/static"));
app.use(cors());

const sttAuthenticator = new IamTokenManager({
  apikey: "qFr1MkJY_nNK-ryIv-83PhaJqg64T7pVq-OZtJj3JqB5", //process.env.SPEECH_TO_TEXT_IAM_APIKEY,
});

// const ttsAuthenticator = new IamTokenManager({
//   apikey: process.env.TEXT_TO_SPEECH_IAM_APIKEY,
// });

/*
{
  "apikey": "qFr1MkJY_nNK-ryIv-83PhaJqg64T7pVq-OZtJj3JqB5",
  "iam_apikey_description": "Auto-generated for key d265f4a0-c666-4bce-ae69-591fdc4ea04a",
  "iam_apikey_name": "Service credentials-1",
  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/661242a81974469ca38e179804cc8cde::serviceid:ServiceId-be2cbf83-58c6-4535-b63f-9d44a5dd4620",
  "url": "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/ff360477-a3ef-4dcf-a72b-29c772b34094"
}
*/

// speech to text token endpoint
app.use("/api/speech-to-text/token", function (req, res) {
  console.log("called");
  return sttAuthenticator
    .requestToken()
    .then(({ result }) => {
      console.log(result);
      res.json({
        accessToken: result.access_token, //,result.refresh_token
        url:
          "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/ff360477-a3ef-4dcf-a72b-29c772b34094", //"https://api.eu-gb.speech-to-text.watson.cloud.ibm.com", //"https://stream.watsonplatform.net/speech-to-text/api", //process.env.SPEECH_TO_TEXT_URL,
      });
    })
    .catch(console.error);
});

// app.use("/api/text-to-speech/token", function (req, res) {
//   return ttsAuthenticator
//     .requestToken()
//     .then(({ result }) => {
//       res.json({
//         accessToken: result.access_token,
//         url: process.env.TEXT_TO_SPEECH_URL,
//       });
//     })
//     .catch(console.error);
// });

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3002;
app.listen(port, function () {
  console.log(
    "Example IBM Watson Speech JS SDK client app & token server live at http://localhost:%s/",
    port
  );
});

// Chrome requires https to access the user's microphone unless it's a localhost url so
// this sets up a basic server on port 3001 using an included self-signed certificate
// note: this is not suitable for production use
// however bluemix automatically adds https support at https://<myapp>.mybluemix.net
if (!process.env.VCAP_SERVICES) {
  const fs = require("fs");
  const https = require("https");
  const HTTPS_PORT = 3001;

  const options = {
    key: fs.readFileSync(__dirname + "/keys/localhost.pem"),
    cert: fs.readFileSync(__dirname + "/keys/localhost.cert"),
  };
  https.createServer(options, app).listen(HTTPS_PORT, function () {
    console.log("Secure server live at https://localhost:%s/", HTTPS_PORT);
  });
}
