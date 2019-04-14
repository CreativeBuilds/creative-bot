const https = require('https');
const config = require('../config');

let msgs = [];
let loop;

// Check the msgs array every 2.1 seconds to send the next message (2.1 seconds to avoid debouncing of dlive);
const checkMessages = () => {
  if (msgs.length <= 0) {
    clearInterval(loop);
    loop = null;
    return;
  }
  let msg = msgs[0];
  msgs = msgs.splice(1);
  const postData = JSON.stringify({
    operationName: 'SendStreamChatMessage',
    query: `mutation SendStreamChatMessage($input: SendStreamchatMessageInput!) {
                sendStreamchatMessage(input: $input) {
                  err {
                    code
                    __typename
                  }
                  message {
                    type
                    ... on ChatText {
                      id
                      content
                      ...VStreamChatSenderInfoFrag
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
              }
              
              fragment VStreamChatSenderInfoFrag on SenderInfo {
                subscribing
                role
                roomRole
                sender {
                  id
                  username
                  displayname
                  avatar
                  partnerStatus
                  __typename
                }
                __typename
              }
              `,
    variables: {
      input: {
        streamer: config.streamer,
        message: msg.message,
        roomRole: 'Moderator',
        subscribing: true
      }
    }
  });

  const options = {
    hostname: 'graphigo.prd.dlive.tv',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: config.authKey,
      'content-type': 'application/json',
      fingerprint: '',
      gacid: 'undefined',
      Origin: 'https://dlive.tv',
      Referer: 'https://dlive.tv/' + config.streamer,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
    }
  };
  var body = '';
  var req = https.request(options, res => {
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', function() {
      msg.cb(body);
    });
  });
  req.write(postData);
  req.end();
};

const sendMessage = (message, streamer) => {
  // TODO add a check to see if message is past max character limit, if it is, split it up into multiple messages
  return new Promise((response, reject) => {
    msgs.push({
      message,
      streamer,
      cb: body => {
        response(body);
      }
    });
    if (!loop) {
      checkMessages();
      setInterval(() => {
        checkMessages();
      }, 2100);
    }
  });
};

module.exports = sendMessage;
