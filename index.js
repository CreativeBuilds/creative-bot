const WebSocket = require('ws');
const fs = require('fs');
const config = require('./config');
const axios = require('axios');
const https = require('https');
const querystring = require('querystring');
const {sendMessage}= require('./helpers');

// const postData = JSON.stringify({
//   operationName: 'SendStreamChatMessage',
//   query: `mutation SendStreamChatMessage($input: SendStreamchatMessageInput!) {
//         sendStreamchatMessage(input: $input) {
//           err {
//             code
//             __typename
//           }
//           message {
//             type
//             ... on ChatText {
//               id
//               content
//               ...VStreamChatSenderInfoFrag
//               __typename
//             }
//             __typename
//           }
//           __typename
//         }
//       }
      
//       fragment VStreamChatSenderInfoFrag on SenderInfo {
//         subscribing
//         role
//         roomRole
//         sender {
//           id
//           username
//           displayname
//           avatar
//           partnerStatus
//           __typename
//         }
//         __typename
//       }
//       `,
//   variables: {
//     input: {
//       streamer: 'creativebuilds',
//       message: 'Auto mated',
//       roomRole: 'Member',
//       subscribing: true
//     }
//   }
// });

// const options = {
//   hostname: 'graphigo.prd.dlive.tv',
//   port: 443,
//   path: '/',
//   method: 'POST',
//   headers: {
//     accept: '*/*',
//     authorization: config.authKey,
//     'content-type': 'application/json',
//     fingerprint: '',
//     gacid: 'undefined',
//     Origin: 'https://dlive.tv',
//     Referer: 'https://dlive.tv/creativebuilds',
//     'User-Agent':
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
//   }
// };
// var body = '';
// var req = https.request(options, res => {
//   res.on('data', chunk => {
//     body += chunk;
//   });
//   res.on('end', function() {
//     console.log('request ended');
//     console.log(body);
//   });
// });
// req.write(postData);
// req.end();

const ws = new WebSocket('wss://graphigostream.prd.dlive.tv', 'graphql-ws');

const commands = {};

const loadCommands = () => {
  fs.readdir(__dirname + '/commands', (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }

    files.forEach(file => {
      let extensionName = file.substring(file.length - 3);
      if (extensionName === '.js') {
        let command = require(`./commands/${file}`);
        commands[command.name] = command;
      }
    });
  });
};

loadCommands();

const textMessage = (message, data) => {
  let { content } = message;
  if (content[0] == config.commandPrefix) {
    content = content.substring(1);
    let args = content.split(' ');
    commandName = args[0];
    let command = commands[commandName];
    if (command) {
      // TODO check permissions
      command.run(message, data).then(msg => {
          if(!msg) return;
          sendMessage(msg);
      })
    }
  }
};

const onNewMsg = data => {
  if (data.type === 'ka') return;
  if (data.type === 'data') {
    // Could be any kind of data
    let payload = data.payload;
    let payData = payload.data;
    for (let i = 0; i < payData.streamMessageReceived.length; i++) {
      let message = payData.streamMessageReceived[i];
      if (message.type === 'Follow') {
        console.log('NEW FOLLOW FROM:', message.sender.displayname);
      }
      if (message.type === 'Gift') {
        console.log(
          'NEW GIFT FROM:',
          message.sender.displayname,
          'TYPE:',
          message.gift,
          'AMOUNT:',
          message.amount
        );
      }
      if (message.type === 'Message') {
        textMessage(message);
        let content = message.content;
        console.log(
          'NEW MSG FROM:',
          message.sender.displayname,
          'MESSAGE: ',
          content
        );
      }
    }
  }
};

ws.on('message', function(data) {
  if (!data || data == null) return;
  onNewMsg(JSON.parse(data));
  
});

ws.on('open', function() {
  ws.send(
    JSON.stringify({
      type: 'connection_init',
      payload: {}
    })
  );
  ws.send(
    JSON.stringify({
      id: '1',
      type: 'start',
      payload: {
        variables: {
          streamer: 'creativebuilds'
        },
        extensions: {},
        operationName: 'StreamMessageSubscription',
        query:
          'subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n'
      }
    })
  );
});
