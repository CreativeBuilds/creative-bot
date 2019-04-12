const WebSocket = require('ws');
const {sendMessage}= require('./helpers');
const { app, BrowserWindow, session, ipcMain } = require('electron');
const fs = require('fs');
let config = require('./config');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');

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
        command.run({ message, data, args }).then(msg => {
          if (!msg) return;
          sendMessage(msg);
        });
      }
    }
  };

  const onNewMsg = data => {
    if (data.type === 'ka') return;
    if (data.type === 'data') {
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
          win.webContents.send('newmessage', ({message, data}))
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
            streamer: config.streamer
          },
          extensions: {},
          operationName: 'StreamMessageSubscription',
          query:
            'subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n'
        }
      })
    );
  });
}

ipcMain.on('sendmessage', (event, {from, message}) => {
  console.log("Sending new message", message);
  sendMessage(message);
})

ipcMain.on('cookies', (event, cookie) => {
  console.log('cookies fired');
  console.log(cookie);
  win.webContents.send('info', { msg: 'test' });
});

app.on('ready', createWindow);
