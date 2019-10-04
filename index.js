/* Simple Emotion Analysis Demo:
 * Read incoming SMS messages and have Watson to analyze the messages
 */

'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening on port ${server.address().port} in ${app.settings.env} mode`);
});

// Reading the inbound SMS messages
const handleRoute = (req, res) => {

  let params = req.body;

  if (req.method === "GET") {
    params = req.query
  }

  if (!params.to || !params.msisdn) {
    res.status(400).send({'error': 'This is not a valid inbound SMS message!'});
  } else {
    analyzeTone(params);
    res.status(200).end();
  }
};

// Using route here to allow for GET or POST from https://dashboard.nexmo.com/settings
app.route('/message')
  .get(handleRoute)
  .post(handleRoute)
  .all((req, res) => res.status(405).send());


function analyzeTone(params) {
  var obj = {
  LanguageCode: "en",
  TextList: [
    params.text,
  ]
};
  var comprehend = new AWS.Comprehend({region: process.env.AWS_REGION});
  comprehend.batchDetectSentiment(obj, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.dir(data, {depth: null})          // successful response
});
}
