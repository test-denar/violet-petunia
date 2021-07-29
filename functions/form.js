'use strict';

const request = require("request");

// Handle the lambda invocation
exports.handler = function(event, context, callback) {
  const { payload } = JSON.parse(event.body)
  const url = process.env.STACKBIT_API_URL;

  console.log(payload);
  console.log(url);

  if (!url) {
    return;
  }
  // post the notification to Slack
  request.post({url: process.env.STACKBIT_API_URL, json: {}}, function(err, httpResponse, body) {
      let msg;
      if (err) {
          msg = 'Form submitted error:' + err;
      }
      else {
          msg = 'From submitted:' + body;
      }
      callback(null, {
          statusCode: 200,
          body: msg
      });
      return console.log(msg);
  });
};
