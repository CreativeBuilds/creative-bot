const WebSocket = require('ws');
const { sendMessage, keepActive, wss, SaveToJson } = require('./helpers');
const { app, BrowserWindow, session, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { distinctUntilChanged } = require('rxjs/operators');
const _ = require('lodash');
let win;

let tryRequireFromStorage = path => {
  try {
    return require(path);
  } catch (err) {
    return {};
  }
};

let config = tryRequireFromStorage('./config.json');
let Commands = tryRequireFromStorage('./storage/commands.json');

let users = tryRequireFromStorage('./storage/users.json');
const rxUsers = require('./helpers/rxUsers');
const rxCommands = require('./helpers/rxCommands');
let { saveUsers, makeNewCommand, saveCommands } = require('./helpers');

rxUsers
  .pipe(
    distinctUntilChanged(
      (x, y) => _.isEqual(x, y) && Object.keys(x) === Object.keys(y)
    )
  )
  .subscribe(Users => {
    saveUsers(Users);
  });

rxCommands
  .pipe(
    distinctUntilChanged(
      (x, y) => _.isEqual(x, y) && Object.keys(x) === Object.keys(y)
    )
  )
  .subscribe(commands => {
    Commands = commands;
    saveCommands(Commands);
  });

require('electron-reload')(path.join(__dirname, 'dist'), {
  electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');

  let users = {};

  rxCommands
    .pipe(
      distinctUntilChanged(
        (x, y) => _.isEqual(x, y) && Object.keys(x) === Object.keys(y)
      )
    )
    .subscribe(commands => {
      win.webContents.send('commands', commands);
    });

  ipcMain.on('editpoints', (event, { username, points }) => {
    let Users = Object.assign({}, users);
    Users[username].points = points;
    rxUsers.next(Users);
  });

  ipcMain.on('removecommand', (event, { name }) => {
    let CommandsCopy = Object.assign({}, Commands);
    if (!CommandsCopy[name]) return;
    delete CommandsCopy[name];
    rxCommands.next(CommandsCopy);
  });

  ipcMain.on('togglecommand', (event, { name, enabled }) => {
    let CommandsCopy = Object.assign({}, Commands);
    if (!CommandsCopy[name]) return;
    CommandsCopy[name].enabled = enabled;
    rxCommands.next(CommandsCopy);
  });

  ipcMain.on('editcommand', (event, { name, oldName, obj }) => {
    let CommandsCopy = Object.assign({}, Commands);
    if (!CommandsCopy[name]) {
      // Making new command;
      if (CommandsCopy[oldName]) delete CommandsCopy[oldName];
    }

    let command = Object.assign(
      {},
      CommandsCopy[name] || {
        name: 'Placeholder',
        dateCreated: Date.now(),
        reply: 'This is a placeholder!',
        uses: 0,
        enabled: true,
        permissions: {}
      },
      obj
    );
    CommandsCopy[name] = command;
    rxCommands.next(CommandsCopy);
  });

  ipcMain.on('getCommands', () => {
    let commands = Object.assign({}, Commands);
    win.webContents.send('commands', commands);
  });

  ipcMain.on('createCommand', (event, { commandName, commandReply }) => {
    makeNewCommand({ commandName, commandReply, Commands })
      .then(commands => (Commands = commands))
      .catch(err => {
        throw err;
      });
  });

  ipcMain.on('getUsermap', () => {
    rxUsers
      .pipe(
        distinctUntilChanged((x, y) => JSON.stringify(x) !== JSON.stringify(y))
      )
      .subscribe(Users => {
        win.webContents.send('usermap', { Users });
        users = Users;
      });
  });

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
      } else {
        command = Commands[commandName];
        if (!command) return;
        if (!command.reply) return;
        // TODO Check permissions
        let obj = {};
        obj[commandName] = Object.assign({}, command);
        obj[commandName].uses += 1;
        Commands = Object.assign({}, Commands, obj);
        if (!command.enabled) return;
        sendMessage(command.reply);
        rxCommands.next(Commands);
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
          const inLino = (gift, amount) => {
            let multiplier = 9.01e2;
            switch (gift) {
              case 'ICE_CREAM':
                multiplier = 9.01e3;
                break;
              case 'DIAMOND':
                multiplier = 9.01e4;
                break;
              case 'NINJAGHINI':
                multiplier = 9.01e5;
                break;
              case 'NINJET':
                multiplier = 9.01e6;
                break;
              default:
                multiplier = 9.01e2;
                break;
            }
            return amount * multiplier;
          };
          win.webContents.send('newdonation', {
            message,
            data,
            inLino: inLino(message.gift, message.amount)
          });
          let username = message.sender.username;
          let Users = Object.assign({}, users);
          if (!Users[username]) {
            Users[username] = {
              points: 0,
              avatar: message.sender.avatar,
              displayname: message.sender.displayname,
              lino: 0,
              username: username,
              role: message.roomRole
            };
          }
          Users[username].lino =
            (Users[username].lino ? Users[username].lino : 0) +
            inLino(message.gift, message.amount);
          rxUsers.next(Users);
        }
        if (message.type === 'Message') {
          textMessage(message);
          keepActive(message);
          win.webContents.send('newmessage', { message, data });
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

  wss.on('connection', function connection(WS) {
    console.log('NEW CONNECTION COMING IN!');
    ws.on('message', data => {
      if (!data || data == null) return;
      if (JSON.parse(data).type === 'ka') return;
      WS.send(data);
    });
    WS.on('message', function incomming(message) {
      let msg = JSON.parse(message);
      if (msg.type === 'key_received') {
        Config = Object.assign({}, { authKey: msg.value.key }, config);
        SaveToJson('./config.json', Config);
      }
    });
    if (!config.authKey || config.authKey === '')
      return WS.send(JSON.stringify({ type: 'key_init' }));
  });

  ws.on('message', data => {
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

ipcMain.on('sendmessage', (event, { from, message }) => {
  sendMessage(message);
});

app.on('ready', createWindow);
