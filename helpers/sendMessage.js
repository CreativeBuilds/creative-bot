const https = require('https');
let config = {};
let rxConfig = require('./rxConfig');
rxConfig.subscribe(data => (config = data));
const sendRequestToDlive = require('./sendRequestToDlive');

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
  sendRequestToDlive({
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
  }).catch(err => {
    throw err;
  });
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
