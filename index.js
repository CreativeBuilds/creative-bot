const WebSocket = require('ws');
const {
  sendMessage,
  keepActive,
  wss,
  SaveToJson,
  sendLino
} = require('./helpers');
const { app, BrowserWindow, session, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { distinctUntilChanged, filter } = require('rxjs/operators');
const _ = require('lodash');
const storage = require('electron-json-storage');
let win;
var env = process.env.NODE_ENV || 'production';
const open = require('open');
console.print = console.log;
if (env === 'production') {
  console.log = () => {};
}
if (process.env.NODE_HARD) {
  storage.clear();
}

let config = {};
let rxListeners = [];
const rxConfig = require('./helpers/rxConfig');
rxConfig.subscribe(data => (config = data));
let Commands = {};
const rxUsers = require('./helpers/rxUsers');
const rxCommands = require('./helpers/rxCommands');
let { makeNewCommand, getBlockchainUsername } = require('./helpers');
const { autoUpdater } = require('electron-updater');

const sendError = (WS, error) => {
  WS.send(JSON.stringify({ type: 'error', value: error }));
};
if (env === 'dev') {
  console.log('inside if');
  try {
    require('electron-reload')(path.join(__dirname, 'dist'), {
      electron: require(`${__dirname}/node_modules/electron`)
    });
  } catch (err) {
    console.error(err);
  }
}

function createWindow() {
  // Create the browser window.
  autoUpdater.checkForUpdatesAndNotify();
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');
  win.on('close', function() {
    process.exit();
  });

  let users = {};

  ipcMain.on('editpoints', (event, { username, points }) => {
    let Users = Object.assign({}, users);
    console.log('username', username, 'points', points, 'users', users);
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
    console.log('getCommands isnt firing');
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

  ipcMain.on('getRxConfig', () => {
    let first = true;
    rxConfig
      .pipe(
        filter(x => {
          if (first && !x.init) {
            first = false;
            return false;
          }
          return true;
        })
      )
      .subscribe(config => {
        win.webContents.send('rxConfig', config);
      });
  });

  ipcMain.on('setRxConfig', (event, Config) => {
    if (Config !== config) {
      config = Config;
      rxConfig.next(Config);
    }
  });
  ipcMain.on('getRxCommands', () => {
    rxCommands.subscribe(config => {
      console.log('sending out commands');
      win.webContents.send('rxCommands', config);
    });
  });

  ipcMain.on('setRxCommands', (event, commands) => {
    if (commands !== Commands) {
      Commands = commands;
      rxCommands.next(commands);
    }
  });
  ipcMain.on('getRxUsers', () => {
    rxUsers.pipe(filter(x => !_.isEmpty(x))).subscribe(Users => {
      console.log('users', Users);
      users = Users;
      win.webContents.send('rxUsers', Users);
    });
  });

  ipcMain.on('setRxUsers', (event, Users) => {
    if (users !== Users) {
      users = Users;
      rxUsers.next(Users);
    }
  });

  ipcMain.on('resetRxConfig', () => {
    rxConfig.next({});
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
        // console.log('MESSAGE', message);

        if (message.type === 'Follow') {
          wss.broadcast(
            JSON.stringify({
              type: 'follow',
              value: message
            })
          );
          console.log('NEW FOLLOW FROM:', message.sender.displayname);
        }
        if (message.type === 'Gift') {
          wss.broadcast(
            JSON.stringify({
              type: 'gift',
              value: message
            })
          );
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
          console.log('users', users);
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
          wss.broadcast(
            JSON.stringify({
              type: 'message',
              value: message
            })
          );
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

  function noop() {}

  wss.on('connection', function connection(WS) {
    let ws = new WebSocket('wss://graphigostream.prd.dlive.tv', 'graphql-ws');
    ws.on('message', data => {
      if (!data || data == null) return;
      if (!WS.isAlive) return;
      if (JSON.parse(data).type === 'ka') return;
      try {
        WS.send(data);
      } catch (e) {
        ws.terminate();
        WS.terminate();
      }
    });
    WS.on('close', function() {
      ws.terminate();
      WS.terminate();
    });
    WS.on('pong', function() {
      WS.isAlive = true;
    });
    WS.on('message', function incoming(message) {
      let msg = JSON.parse(message);
      if (msg.type === 'send_message') {
        sendMessage(message.value);
      } else if (msg.type === 'send_lino') {
        if (!config.privKeyHex)
          return sendError(WS, 'No privKeyHex detected in config.json');
        sendLino(message.value).catch(err => {
          console.error(err);
          sendError(
            WS,
            'Error when sending lino, message.value object most likely invalid! Check bot console for more details.'
          );
        });
      } else if (msg.type === 'key_received') {
        Config = Object.assign({}, { authKey: msg.value.key }, config);
        SaveToJson('config', Config);
      }
    });
    if (!config.authKey || config.authKey === '')
      return WS.send(JSON.stringify({ type: 'key_init' }));
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 1000);

  ws.on('message', data => {
    if (!data || data == null) return;

    onNewMsg(JSON.parse(data));
  });

  ws.on('open', function() {
    rxConfig
      .pipe(
        filter(x => {
          console.log(Object.keys(x));
          let Config = Object.assign({}, x);
          if (
            Config.streamerDisplayName &&
            Config.authKey &&
            !Config.streamer
          ) {
            getBlockchainUsername(Config.streamerDisplayName).then(username => {
              if (username.length === 0) return;
              Config.streamer = username;
              if (Config !== config) {
                config = Config;
                rxConfig.next(Config);
              }
            });
            return false;
          }
          return !!x.streamer;
        })
      )
      .subscribe(config => {
        console.log('STARTED WS WITH CONFIG', config.streamer);
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
  });
}

ipcMain.on('sendmessage', (event, { from, message }) => {
  sendMessage(message);
});

app.on('ready', createWindow);
