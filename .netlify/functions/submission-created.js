'use strict';

const axios = require("axios");

// Handle the lambda invocation
exports.handler = function(event, context, callback) {
  try {
    const url = process.env.STACKBIT_API_URL;
    const projectId = process.env.STACKBIT_PROJECT_ID;

    if (!url) {
      throw new Error('No Stackbit URL specified')
    }
    if (!url) {
      throw new Error('No Stackbit project id specified')
    }
    console.log('test')

    axios({
        method: 'post',
        url,
        data: {
          projectId,
          ...JSON.parse(event.body)
        }
    }).then(response => {
      callback(null, {
        statusCode: 200,
        body: response.data.status
      });
    }).catch(e => {
      callback(null, {
        statusCode: e.response.status,
        body: e.response.statusText
      });
    });
  } catch(e) {
    console.log('eeee');
    callback(null, {
      statusCode: 500,
      body: e.message
    });
  }
};
