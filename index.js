const {
  sendMessage,
  keepActive,
  wss,
  SaveToJson,
  sendLino
} = require('./helpers');
const log = require('electron-log');
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { distinctUntilChanged, filter, first } = require('rxjs/operators');
const _ = require('lodash');
const storage = require('electron-json-storage');
const DLive = require('dlive-js');
let dlive;
let win;
var env = process.env.NODE_ENV || 'production';
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
let Giveaways = {};
const rxUsers = require('./helpers/rxUsers');
const rxCommands = require('./helpers/rxCommands');
const rxGiveaways = require('./helpers/rxGiveaways');
const rxLists = require('./helpers/rxLists');
const getCustomVariables = require('./helpers/getCustomVariables');
const parseReply = require('./helpers/parseReply');
rxCommands.subscribe(commands => (Commands = commands));
const rxTimers = require('./helpers/rxTimers');
let { makeNewCommand, getBlockchainUsername } = require('./helpers');
const { autoUpdater } = require('electron-updater');
require('./helpers/startTimers').run();

const { removeMessage } = require('./helpers/removeMessage');

rxConfig
  .pipe(
    filter(x => {
      let Config = Object.assign({}, x);
      if (
        Config.streamerDisplayName &&
        Config.authKey &&
        Config.streamerOldDisplayName !== Config.streamerDisplayName
      ) {
        getBlockchainUsername(Config.streamerDisplayName).then(username => {
          console.log(
            Config.streamerOldDisplayName,
            config.streamerDisplayName
          );
          if (username.length === 0) return;
          Config.streamer = username;
          Config.streamerOldDisplayName = Config.streamerDisplayName;
          rxConfig.next(Config);
        });
        return false;
      }
      return !!x.streamer;
    })
  )
  .subscribe(config => {
    console.log('set config streamer name');
  });

const sendError = (WS, error) => {
  WS.send(JSON.stringify({ type: 'error', value: error }));
};
if (env === 'dev') {
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
  win = new BrowserWindow({ width: 1280, height: 720, frame: false });

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');
  win.on('close', function() {
    process.exit();
  });

  let oldGiveaways = { first: true };
  let timeouts = [];
  rxGiveaways.subscribe(giveaways => {
    /**
     * 1. Detect new giveaways
     * 2. get rid of old ones?
     */
    timeouts.forEach(interval => {
      clearTimeout(interval);
    });
    let determineDifference = (arr, obj) => {
      let newArr = [];
      arr.forEach(key => {
        if (obj[key]) return;
        newArr.push(key);
      });
      return newArr;
    };
    if (oldGiveaways.first && Object.keys(giveaways).length === 0)
      return (oldGiveaways.first = false);
    if (oldGiveaways.first) oldGiveaways = giveaways;

    let keysNew = Object.keys(giveaways);
    let keysOld = Object.keys(oldGiveaways);
    if (keysNew !== keysOld) {
      let newGiveaways = determineDifference(keysNew, oldGiveaways);
      if (newGiveaways.length > 0) {
        newGiveaways.forEach(key => {
          let giveaway = giveaways[key];
          sendMessage(
            `A new giveaway has started for '${
              giveaway.reward
            }'! Ticket cost: ${giveaway.cost} | Max Tickets: ${
              giveaway.maxEntries
            } | Join with !${giveaway.name} ${
              giveaway.cost > 0 && giveaway.maxEntries > 0
                ? 'amountOfTicketsToBuy'
                : ''
            }`
          );
        });
      }
    }
    Object.keys(giveaways).forEach(key => {
      let giveaway = giveaways[key];
      if (giveaway.secondsUntilClose !== 0) {
        let milliSecondsLeft = Math.floor(
          giveaway.createdAt + giveaway.secondsUntilClose * 1000 - Date.now()
        );
        timeouts.push(
          setTimeout(() => {
            sendMessage(
              `Giveaway ${giveaway.name} has ended for ${giveaway.reward}!`
            );
          }, milliSecondsLeft)
        );
        if (milliSecondsLeft > 15000)
          timeouts.push(
            setTimeout(() => {
              sendMessage(
                `Giveaway ${giveaway.name} for ${
                  giveaway.reward
                } has 15 seconds left hurry up and enter with !${
                  giveaway.name
                } !`
              );
            }, milliSecondsLeft - 15000)
          );
      }
      if (giveaway.winners) {
        if (giveaway.winners.length > 0) {
          let winner = giveaway.winners[giveaway.winners.length - 1];
          sendMessage(`${winner.name} has won the giveaway! Speak up in chat!`);
        }
      }
    });

    if (giveaways !== oldGiveaways) oldGiveaways = giveaways;
  });

  let users = {};

  ipcMain.on('editpoints', (event, { username, points }) => {
    let Users = Object.assign({}, users);
    Users[username].points = points;
    rxUsers.next(Users);
  });

  ipcMain.on('removecommand', (event, { name }) => {
    let CommandsCopy = Object.assign({}, Commands);
    if (!CommandsCopy[name]) return;
    delete CommandsCopy[name];
    d;
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

  ipcMain.on('removeMessage', (event, { id, streamer }) => {
    removeMessage(id, streamer).then(() => {
      win.webContents.send('removedMessage', { id, streamer });
    });
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

  let lists = {};

  ipcMain.on('getRxLists', () => {
    rxLists.subscribe(lists => {
      win.webContents.send('rxLists', lists);
    });
  });

  ipcMain.on('setRxLists', (event, Lists) => {
    if (Lists !== lists) {
      lists = Lists;
      rxLists.next(Lists);
    }
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
      win.webContents.send('rxCommands', config);
    });
  });

  ipcMain.on('setRxCommands', (event, commands) => {
    if (commands !== Commands) {
      Commands = commands;
      rxCommands.next(commands);
    }
  });

  ipcMain.on('getRxGiveaways', () => {
    rxGiveaways.subscribe(giveaways => {
      win.webContents.send('rxGiveaways', giveaways);
    });
  });

  ipcMain.on('setRxGiveaways', (event, giveaways) => {
    if (giveaways !== Giveaways) {
      Giveaways = giveaways;
      rxGiveaways.next(giveaways);
    }
  });

  ipcMain.on('getRxTimers', () => {
    rxTimers.subscribe(timers => {
      win.webContents.send('rxTimers', timers);
    });
  });

  ipcMain.on('setRxTimers', (event, timers) => {
    rxTimers.pipe(first()).subscribe(Timers => {
      if (timers !== Timers) {
        rxTimers.next(timers);
      }
    });
  });
  ipcMain.on('getRxUsers', () => {
    rxUsers.pipe(filter(x => !_.isEmpty(x))).subscribe(Users => {
      let obj = {};
      let change = false;
      Object.keys(Users).forEach(blockchainUsername => {
        let user = Users[blockchainUsername];
        if (user.username) {
          user.blockchainUsername = user.username;
          delete user.username;
          change = true;
        }
        if (user.displayname) {
          user.dliveUsername = user.displayname;
          delete user.displayname;
          change = true;
        }
        obj[blockchainUsername] = user;
      });
      users = obj;
      if (change) {
        rxUsers.next(obj);
      }
      win.webContents.send('rxUsers', obj);
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

  // const ws = new WebSocket('wss://graphigostream.prd.dlive.tv', 'graphql-ws');

  const commands = {};
  let custom_variables = {};
  getCustomVariables().then(variables => {
    custom_variables = variables;
  });

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

  const textMessage = (message, streamerDisplayName, data) => {
    let { content } = message;
    if (content[0] == config.commandPrefix) {
      content = content.substring(1);
      let args = content.split(' ');
      commandName = args[0];
      let command = commands[commandName];
      if (command && !(commandName === 'points' && !!Commands[commandName])) {
        // TODO check permissions
        command.run({ message, data, args }).then(msg => {
          if (!msg) return;
          sendMessage(msg);
        });
      } else if (Commands[commandName]) {
        command = Commands[commandName];
        if (!command) return;
        if (!command.reply) return;
        // TODO Check permissions
        let obj = {};
        obj[commandName] = Object.assign({}, command);
        obj[commandName].uses += 1;
        Commands = Object.assign({}, Commands, obj);
        if (!command.enabled) return;
        if (!dlive) {
          parseReply({
            reply: command.reply,
            message,
            custom_variables,
            streamChannel: null
          }).then(reply => {
            sendMessage(reply);
            rxCommands.next(Commands);
          });
        } else {
          dlive.getChannel(streamerDisplayName).then(streamChannel => {
            parseReply({
              reply: command.reply,
              message,
              custom_variables,
              streamChannel
            }).then(reply => {
              sendMessage(reply);
              rxCommands.next(Commands);
            });
          });
        }
      } else {
        rxGiveaways.pipe(first()).subscribe(giveaways => {
          let giveaway = Object.assign({}, giveaways[commandName]);
          if (!giveaways[commandName]) return;
          if (typeof giveaway.winners !== 'undefined')
            return sendMessage(
              `${
                message.sender.dliveUsername
              } that giveaway already has a winner!`
            );
          let one = giveaway.createdAt + giveaway.secondsUntilClose * 1000;
          let secondsLeft = one - Date.now();
          if (giveaway.secondsUntilClose === 0 || secondsLeft > 0) {
            // User can enter check to see if they have enough in their balance;
            rxUsers.pipe(first()).subscribe(users => {
              let sender = message.sender.blockchainUsername;
              if (!users[sender]) return;
              let user = Object.assign({}, users[sender]);
              if (user.points > giveaway.cost) {
                if (!giveaway.entires) giveaway.entires = {};
                if (giveaway.cost === 0) {
                  if (!giveaway.entries[sender]) {
                    let newObj = {};
                    newObj[sender] = {
                      tickets: 1,
                      displayname: message.sender.dliveUsername,
                      username: sender
                    };
                    giveaway.entries = Object.assign(
                      {},
                      giveaway.entries,
                      newObj
                    );
                    sendMessage(
                      `${
                        message.sender.dliveUsername
                      } has entered the giveaway with 1 ticket!`
                    );
                  }
                } else if (
                  giveaway.maxEntries > 0 &&
                  giveaway.entires[sender]
                ) {
                  let giveawayUser = giveaway.entires[sender];
                  if (giveawayUser.tickets >= giveaway.maxEntries) return;
                  let ticketsToPurchase = Number(args[1]);
                  if (isNaN(ticketsToPurchase)) ticketsToPurchase = 1;
                  ticketsToPurchase = Math.abs(ticketsToPurchase);
                  let totalCost = ticketsToPurchase * giveaway.cost;
                  if (totalCost >= user.points)
                    return sendMessage(
                      `${
                        message.sender.dliveUsername
                      } there has been an error, you do not have enough points to purchase this ticket(s). Total Cost: ${totalCost}`
                    );
                  let newObj = {};
                  newObj[sender] = {
                    tickets: ticketsToPurchase + giveawayUser.tickets,
                    displayname: message.sender.dliveUsername,
                    username: sender
                  };
                  giveaway.entries = Object.assign(
                    {},
                    giveaway.entries,
                    newObj
                  );
                  user.points -= totalCost;
                  let usersObj = {};
                  usersObj[sender] = user;
                  rxUsers.next(Object.assign({}, users, usersObj));
                  sendMessage(
                    `${
                      message.sender.dliveUsername
                    } has purchased more tickets for the giveaway with a total of ${ticketsToPurchase +
                      giveawayUser.tickets} tickets!`
                  );
                  // Check to see
                } else {
                  let ticketsToPurchase = Number(args[1]);
                  if (isNaN(ticketsToPurchase)) ticketsToPurchase = 1;
                  if (ticketsToPurchase > giveaway.maxEntries)
                    ticketsToPurchase = giveaway.maxEntries;
                  let totalCost = ticketsToPurchase * giveaway.cost;
                  if (totalCost > user.points)
                    return sendMessage(
                      `${
                        message.sender.dliveUsername
                      } there has been an error, you do not have enough points to purchase this ticket(s). Total Cost: ${totalCost}`
                    );
                  let newObj = {};
                  newObj[sender] = {
                    tickets: ticketsToPurchase,
                    displayname: message.sender.dliveUsername,
                    username: sender
                  };
                  giveaway.entries = Object.assign(
                    {},
                    giveaway.entries,
                    newObj
                  );
                  user.points -= totalCost;
                  let usersObj = {};
                  usersObj[sender] = user;
                  rxUsers.next(Object.assign({}, users, usersObj));
                  // TODO make helper file to handle a lot of users joining at once, so the bot doesnt lag aka (john, steve, and sam have entered the giveaway!);
                  sendMessage(
                    `${
                      message.sender.dliveUsername
                    } has entered the giveaway with ${ticketsToPurchase} ticket(s)!`
                  );
                }
                let newObj = {};
                newObj[commandName] = giveaway;
                if (giveaway === giveaways[commandName]) return;

                rxGiveaways.next(Object.assign({}, giveaways, newObj));
              } else {
                sendMessage(
                  `${
                    message.sender.dliveUsername
                  } you do not have enough points for that!`
                );
              }
            });
          }
        });
      }
    }
  };

  const onNewMsg = (message, streamerDisplayName) => {
    if (message.type === 'Follow') {
      wss.broadcast(
        JSON.stringify({
          type: 'follow',
          value: message
        })
      );
      console.log('NEW FOLLOW FROM:', message.sender.dliveUsername);
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
        message.sender.dliveUsername,
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
      // TODO ADD FRONTEND STUFF FOR THIS
      win.webContents.send('newdonation', {
        message,
        inLino: message.inLino
      });
      let username = message.sender.blockchainUsername;
      let Users = Object.assign({}, users);
      if (!Users[username]) {
        Users[username] = {
          points: 0,
          avatar: message.sender.avatar,
          displayname: message.sender.dliveUsername,
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
      textMessage(message, streamerDisplayName);
      keepActive(message);
      win.webContents.send('newmessage', { message });
      let content = message.content;
      console.log(
        'NEW MSG FROM:',
        message.sender.dliveUsername,
        'MESSAGE: ',
        content
      );
    }
  };

  // This wss is for ben
  wss.on('connection', function connection(WS) {
    let subscriber;
    rxConfig
      .pipe(
        filter(x => !!x.authKey),
        first()
      )
      .subscribe(config => {
        if (!dlive) dlive = new DLive({ authKey: config.authKey });
        dlive.listenToChat(config.streamerDisplayName).then(messages => {
          subscriber = messages.subscribe(message => {
            WS.send(JSON.stringify(message));
          });
        });
      });
    WS.on('close', function() {
      subscriber.unsubscribe();
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
  // This is for the app
  rxConfig
    .pipe(
      filter(x => !!x.authKey),
      first()
    )
    .subscribe(config => {
      dlive = new DLive({ authKey: config.authKey });
      dlive.listenToChat(config.streamerDisplayName).then(messages => {
        messages.subscribe(message => {
          onNewMsg(message, config.streamerDisplayName);
        });
      });
    });
  rxConfig
    .pipe(
      filter(x => !!x.authKey),
      filter(x => {
        return typeof x.streamerDisplayName === 'string';
      }),
      first()
    )
    .subscribe(config => {
      dlive.getChannel(config.streamerDisplayName).then(channel => {
        channel.rxLivestream.subscribe(livestream => {
          if (!livestream) return;
          if (typeof livestream === 'object') {
            if (Object.keys(livestream).length === 0) return;
            win.webContents.send('livestreamObject', livestream);
          }
        });
      });
    });
}

ipcMain.on('sendmessage', (event, { from, message }) => {
  if (config.authKey != null || config.username != null) {
    sendMessage(message);
  } else {
    console.log(
      "Can't Connect to Dlive Channel because you possibly havent entered a Username and Auth Key"
    );

    var bannerMessage = {
      needsBanner: true,
      message:
        "Can't Connect to Dlive because You may have not correctly entered a Username and Auth Key",
      type: 'error',
      alertType: 'alert'
    };

    event.sender.send('bannermessage', [bannerMessage]);
  }
});

app.on('ready', createWindow);
