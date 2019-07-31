const { sendMessage, wss, sendLino } = require('./helpers');
const { keepActive, init } = require('./helpers/keepActive');
const setRxUsers = require('./helpers/setRxUsers');
const log = require('electron-log');
const storage = require('electron-json-storage');
const { app, BrowserWindow, ipcMain } = require('electron');
// app.setAppUserModelId('creativebot');
app.commandLine.appendSwitch('enable-speech-dispatcher');
const debug = require('electron-debug');
debug({ showDevTools: false, isEnabled: true });
const fs = require('fs');
const path = require('path');
const { isEmpty } = require('lodash');
const { BehaviorSubject, timer } = require('rxjs');
const {
  distinctUntilChanged,
  filter,
  first,
  skip,
  debounce
} = require('rxjs/operators');
const _ = require('lodash');

const express = require('express');
const APP = express();
const port = 6942;

// const DLive = require('dlive-js');
const { rxDlive } = require('./helpers/rxDlive');
let dlive;
let win;
var env = process.env.NODE_ENV || 'production';
console.print = console.log;
if (env === 'production') {
  console.log = () => {};
}

let config = {};
let rxListeners = [];
const rxConfig = require('./helpers/rxConfig');
let firstConfig = {};
rxConfig.subscribe(data => (config = data));
rxConfig
  .pipe(
    filter(x => !_.isEmpty(x)),
    first()
  )
  .subscribe(data => (firstConfig = data));
rxConfig
  .pipe(
    filter(x => !!x.authKey && !!x.streamer),
    first()
  )
  .subscribe(config => {
    if (config.noInitMessage) return;
    if (env !== 'production') return;
    sendMessage(
      `CreativeBot initialized, if you have any issues please report them in the support discord https://discord.gg/2DGaWDW`
    );
  });
let Commands = {};
let Giveaways = {};
const rxUsers = require('./helpers/rxUsers');
const rxCommands = require('./helpers/rxCommands');
const rxGiveaways = require('./helpers/rxGiveaways');
const rxLists = require('./helpers/rxLists');
const rxEmotes = require('./helpers/rxEmotes');
const rxQuotes = require('./helpers/rxQuotes');
const getCustomVariables = require('./helpers/getCustomVariables');
const parseReply = require('./helpers/parseReply');
rxCommands.subscribe(commands => (Commands = commands));
const rxTimers = require('./helpers/rxTimers');
let { makeNewCommand, getBlockchainUsername } = require('./helpers');
const { autoUpdater } = require('electron-updater');
autoUpdater.allowPrerelease = true;
require('./helpers/startTimers').run();

const {
  removeMessage,
  timeoutUser,
  muteUser
} = require('./helpers/removeMessage');

let verifyStreamerDisplayName = config => {
  return getBlockchainUsername(config.streamerDisplayName, config)
    .then(username => {
      if (username.length === 0) return false;
      return username;
    })
    .catch(err => {
      delete config.authKey;
      win.webContents.send('rxConfig', config);
    });
};

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

  if (env === 'dev' || env === 'dev_watch') {
    win = new BrowserWindow({
      width: 1280,
      height: 720,
      frame: false,
      icon: path.join(__dirname, 'dist/.icon-ico/icon_Dev.ico')
    });
  } else {
    win = new BrowserWindow({ width: 1280, height: 720, frame: false });
  }
  autoUpdater.on('update-available', () => {
    autoUpdater.downloadUpdate();
  });
  autoUpdater.on('update-downloaded', () => {
    // autoUpdater.quitAndInstall(true, true);
    win.webContents.send('new-update');
  });
  autoUpdater.checkForUpdates();
  init(win);

  // and load the index.html of the app.
  if (env === 'dev_watch') {
    win.loadURL('http://localhost:8080/webpack-dev-server/');
  } else {
    win.loadURL(`file://${__dirname}/dist/index.html`);
  }
  win.on('close', function() {
    process.exit();
  });

  let oauthWindowStart = () => {
    let popup = new BrowserWindow({ width: 400, height: 600, frame: false });
    popup.webContents.on('did-finish-load', function() {
      let injectJs = `function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }
    
    addStyleString('.container{ max-height: 100vh !important; overflow-y: auto !important;height:min-content;display:block;}');`;
      popup.webContents.executeJavaScript(injectJs);
    });
    popup.loadURL(
      `https://dlive.tv/o/authorize?client_id=2582484581&redirect_uri=https://creativebuilds.io/oauth/dlive&response_type=code&scope=identity%20chat:write%20chest:write%20comment:write%20email:read%20emote:read%20emote:write%20moderation:read%20moderation:write%20relationship:read%20relationship:write%20streamtemplate:read%20streamtemplate:write%20subscription:read%20subsetting:write%20&state=http://localhost:6942/oauth`
    );

    popup.webContents.on(
      'did-fail-load',
      (event, e, desc, url, isMainFrame) => {
        console.log('FAILED', e, desc, url, isMainFrame);
      }
    );

    popup.webContents.on('will-redirect', (event, url) => {
      // console.log('GOT NEW URL', url.slice(0, 10));
      if (url.startsWith('http://localhost')) {
        // console.log('URL STARTS WITH THIS');
        let auth = url.split('?auth=')[1];
        // console.log('GOT AUTH', url.split('?=auth='));
        if (!auth) {
          popup.close();
          oauthWindowStart();
        } else {
          // We got auth string boiiiiss time to set it on the
          win.webContents.send('newAuthKey', auth);
          popup.close();
        }
      }
    });
  };

  ipcMain.on('oauthWindowStart', () => {
    oauthWindowStart();
  });

  rxConfig
    .pipe(
      distinctUntilChanged((prev, curr) => {
        let Config = Object.assign({}, curr);
        let Prev = Object.assign({}, prev);
        if (
          (Config.streamerDisplayName &&
            Config.authKey &&
            Config.streamerDisplayName !== Prev.streamerDisplayName) ||
          !Config.streamer
        ) {
          return false;
        }
        return true;
      })
    )
    .subscribe(Config => {
      if (!Config.authKey || !Config.streamerDisplayName) return;
      verifyStreamerDisplayName(Config)
        .then(username => {
          if (username) {
            let config = Object.assign({}, Config, { streamer: username });
            win.webContents.send('rxConfig', config);
          } else {
            return;
          }
        })
        .catch(err => {
          delete config.authKey;
          win.webContents.send('rxConfig', config);
        });
    });

  let oldGiveaways = { first: true };
  let timeouts = [];
  let winnersSentMessages = {};
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
          if (giveaway.winners) return;
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
        if (milliSecondsLeft > 0) {
          timeouts.push(
            setTimeout(() => {
              sendMessage(
                `Giveaway ${giveaway.name} has ended for ${giveaway.reward}!`
              );
            }, milliSecondsLeft)
          );
        }
        if (milliSecondsLeft > 15000)
          timeouts.push(
            setTimeout(() => {
              rxConfig.pipe(first()).subscribe(config => {
                sendMessage(
                  `The giveaway '${config.commandPrefix}${giveaway.name}' for ${
                    giveaway.reward
                  } has 15 seconds left hurry up and enter with !${
                    giveaway.name
                  } !`
                );
              });
            }, milliSecondsLeft - 15000)
          );
      }
      if (giveaway.winners) {
        if (giveaway.winners.length > 0) {
          console.log('giveaway winners', giveaway.winners);
          let winner = giveaway.winners[giveaway.winners.length - 1];
          if (
            winnersSentMessages[winner.username] &&
            Date.now() - (winnersSentMessages[winner.username] || Date.now()) <=
              5000
          ) {
            return;
          } else {
            winnersSentMessages[winner.username] = Date.now();
          }
          sendMessage(`${winner.name} has won the giveaway! Speak up in chat!`);
        }
      }
    });

    if (giveaways !== oldGiveaways) oldGiveaways = giveaways;
  });

  let users = {};

  setRxUsers.pipe(skip(1)).subscribe(users => {
    win.webContents.send('rxUsers', users);
  });

  ipcMain.on('editpoints', (event, { username, points }) => {
    rxUsers.pipe(first()).subscribe(users => {
      let Users = Object.assign({}, users);
      console.log(username, 'USERNAME', Users[username]);
      Users[username].points = points;
      setRxUsers.next(Users);
    });
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

  ipcMain.on('logout', () => {
    setTimeout(() => {
      process.exit();
    }, 1000);
  });

  ipcMain.on('shutdown', () => {
    process.exit();
  });

  // ipcMain.on('backup-data', (event, dir) => {
  //   var dateObj = new Date();
  //   var date =
  //     String(dateObj.getDay()) +
  //     '_' +
  //     String(dateObj.getMonth()) +
  //     '_' +
  //     String(dateObj.getFullYear());
  //   var time =
  //     String(dateObj.getHours()).padStart(2, '0') +
  //     '_' +
  //     String(dateObj.getMinutes()).padStart(2, '0') +
  //     '_' +
  //     String(dateObj.getSeconds()).padStart(2, '0');
  //   var source = storage.getDefaultDataPath();
  //   exportBackupData(source, dir, 'creativebot_backup_' + date + '_' + time);
  // });

  //REMOVED IN 1.7
  // ipcMain.on('import-backup-data', (event, source) => {
  //   var dir = storage.getDefaultDataPath();
  //   importBackupData(path.resolve(source), path.resolve(dir));
  // });

  ipcMain.on('triggerBannerMessage', (event, bannerMessage) => {
    event.sender.send('show-bannermessage', [bannerMessage]);
  });

  ipcMain.on('closeBannerMessage', event => {
    event.sender.send('hide-bannermessage');
  });

  ipcMain.on('getCommands', () => {
    let commands = Object.assign({}, Commands);
    win.webContents.send('commands', commands);
  });

  ipcMain.on('removeMessage', (event, { id, streamer }) => {
    removeMessage(id, streamer)
      .then(() => {
        win.webContents.send('removedMessage', { id, streamer });
      })
      .catch(err => {
        delete config.authKey;
        win.webContents.send('rxConfig', config);
      });
  });

  ipcMain.on('timeoutUser', (event, { id, streamer }) => {
    timeoutUser(id, streamer);
  });

  ipcMain.on('muteUser', (event, { id, streamer }) => {
    muteUser(id, streamer);
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

  let emotes = {};

  ipcMain.on('getRxEmotes', () => {
    rxEmotes.subscribe(emotes => {
      win.webContents.send('rxEmotes', emotes);
    });
  });

  ipcMain.on('setRxEmotes', (event, Emotes) => {
    if (Emotes !== emotes) {
      emotes = Emotes;
      rxEmotes.next(Emotes);
    }
  });

  let quotes = {};

  ipcMain.on('getRxQuotes', () => {
    rxQuotes.subscribe(quotes => {
      console.log('SENDING QUOTES', Object.keys(quotes).length);
      win.webContents.send('rxQuotes', quotes);
    });
  });

  ipcMain.on('setRxQuotes', (event, Quotes) => {
    if (Quotes !== quotes) {
      quotes = Quotes;
      rxQuotes.next(Quotes);
    }
  });

  ipcMain.on('getRxConfig', () => {
    let copyFirstConfig = Object.assign({}, firstConfig);
    if (!copyFirstConfig.authKey) return;
    win.webContents.send('rxConfigFirst', copyFirstConfig);
  });

  ipcMain.on('setRxConfig', (event, Config) => {
    console.log('TRYING TO SET RXCONFIG');
    if (Config !== config) {
      console.log('past the first check');
      config = Config;
      if (!Config.authKey || !Config.streamerDisplayName) {
        console.log('INSIDE THE SECOND IF');
        return rxConfig.next(Config);
      }
      verifyStreamerDisplayName(Config)
        .then(bool => {
          console.log('got to bool');
          if (bool) {
            rxConfig.next(Config);
            win.webContents.send('passedConfig');
          } else {
            win.webContents.send(
              'failedConfig',
              `Error Updating... Streamer: ${
                Config.streamerDisplayName
              } is not found!`
            );
          }
        })
        .catch(err => {
          delete config.authKey;
          win.webContents.send('rxConfig', config);
        });
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
    console.log('GOT GET RX GIVEAWAYS');
    rxGiveaways.subscribe(giveaways => {
      console.log('SENDING GIVEAWAYS OBJECT TO CLIENT', giveaways);
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
  // ipcMain.on('getRxUsers', () => {
  //   rxUsers.pipe(filter(x => !!x)).subscribe(Users => {
  //     let obj = {};
  //     let change = false;
  //     Object.keys(Users).forEach(blockchainUsername => {
  //       let user = Users[blockchainUsername];
  //       if (user.username) {
  //         user.blockchainUsername = user.username;
  //         delete user.username;
  //         change = true;
  //       }
  //       if (user.displayname) {
  //         user.dliveUsername = user.displayname;
  //         delete user.displayname;
  //         change = true;
  //       }
  //       obj[blockchainUsername] = user;
  //     });
  //     users = obj;
  //     if (change) {
  //       rxUsers.next(obj);
  //     }
  //     win.webContents.send('rxUsers', obj);
  //   });
  // });

  ipcMain.on('setRxUsers', (event, Users) => {
    if (users !== Users) {
      console.log('SETTING RXUSER');
      users = Users;
      rxUsers.next(Users);
    }
  });

  ipcMain.on('getAllOldData', event => {
    storage.get('users', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxUsers', data);
    });
    storage.get('commands', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxCommands', data);
    });
    storage.get('timers', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxTimers', data);
    });
    storage.get('emotes', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxEmotes', data);
    });
    storage.get('giveaways', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxGiveaways', data);
    });
    storage.get('quotes', (err, data = {}) => {
      if (err) throw err;
      win.webContents.send('rxQuotes', data);
    });

    rxConfig.pipe(first()).subscribe(config => {
      config.ported = true;
      win.webContents.send('rxConfig', config);
    });
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
    console.log('INSIDE TEXT MESSAGE', content);
    if (!content) return;
    rxConfig.pipe(first()).subscribe(config => {
      if (content.length > 0 && content.startsWith(config.commandPrefix)) {
        content = content.substring(1);
        let args = content.split(' ');
        commandName = args[0];
        let command = commands[commandName];
        console.log(
          'ITS A COMMAND',
          Commands,
          commandName,
          streamerDisplayName
        );
        if (command && !(commandName === 'points' && !!Commands[commandName])) {
          // TODO check permissions
          command.run({ message, data, args }).then(msg => {
            if (!msg) return;
            sendMessage(msg).catch(err => {
              delete config.authKey;
              win.webContents.send('rxConfig', config);
            });
          });
        } else if (Commands[commandName]) {
          console.log('INSIDE COMMAND');
          command = Commands[commandName];
          console.log(command);
          if (!command) return console.log('no command');
          if (!command.reply) return console.log('no reply');
          // TODO Check permissions
          let obj = {};
          obj[commandName] = Object.assign({}, command);
          // obj[commandName].uses += 1;
          Commands = Object.assign({}, Commands, obj);
          if (!command.enabled) return console.log('command not enabled');
          // sendMessage(`Fetching info...`);
          rxDlive.pipe(filter(x => !!x)).subscribe(dlive => {
            dlive.getChannel(streamerDisplayName).then(streamChannel => {
              parseReply({
                reply: command.reply,
                message,
                custom_variables,
                streamChannel
              }).then(reply => {
                console.log('GOT REPLY', reply);
                sendMessage(reply).catch(err => {
                  delete config.authKey;
                  win.webContents.send('rxConfig', config);
                });
                rxCommands.next(Commands);
              });
            });
          });
          // if (!dlive) {
          //   parseReply({
          //     reply: command.reply,
          //     message,
          //     custom_variables,
          //     streamChannel: null
          //   }).then(reply => {
          //     console.log('GOT REPLY WITHOUT DLIVEJS', reply);
          //     sendMessage(reply);
          //     rxCommands.next(Commands);
          //   });
          // } else {

          // }
        } else {
          console.log('CHECKING TO SEE IF GIVEAWAY EXISTS');
          rxGiveaways.pipe(first()).subscribe(giveaways => {
            console.log('giveaways', giveaways);
            let giveaway = Object.assign({}, giveaways[commandName]);
            if (!giveaways[commandName]) return;
            if (typeof giveaway.winners !== 'undefined')
              return sendMessage(
                `${
                  message.sender.dliveUsername
                } that giveaway has a winner and is closed!`
              ).catch(err => {
                delete config.authKey;
                win.webContents.send('rxConfig', config);
              });
            let one = giveaway.createdAt + giveaway.secondsUntilClose * 1000;
            let secondsLeft = one - Date.now();
            if (giveaway.secondsUntilClose === 0 || secondsLeft > 0) {
              // User can enter check to see if they have enough in their balance;
              rxUsers.pipe(first()).subscribe(users => {
                let sender = message.sender.blockchainUsername;
                if (!users[sender]) return;
                let user = Object.assign({}, users[sender]);
                if (user.points > giveaway.cost) {
                  if (!giveaway.entries) giveaway.entries = {};
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
                      ).catch(err => {
                        delete config.authKey;
                        win.webContents.send('rxConfig', config);
                      });
                    }
                  } else if (
                    giveaway.maxEntries > 0 &&
                    giveaway.entries[sender]
                  ) {
                    let giveawayUser = giveaway.entries[sender];
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
                      ).catch(err => {
                        delete config.authKey;
                        win.webContents.send('rxConfig', config);
                      });
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
                    setRxUsers.next(Object.assign({}, users, usersObj));
                    sendMessage(
                      `${
                        message.sender.dliveUsername
                      } has purchased more tickets for the giveaway with a total of ${ticketsToPurchase +
                        giveawayUser.tickets} tickets!`
                    ).catch(err => {
                      delete config.authKey;
                      win.webContents.send('rxConfig', config);
                    });
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
                      ).catch(err => {
                        delete config.authKey;
                        win.webContents.send('rxConfig', config);
                      });
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
                    setRxUsers.next(Object.assign({}, users, usersObj));
                    // TODO make helper file to handle a lot of users joining at once, so the bot doesnt lag aka (john, steve, and sam have entered the giveaway!);
                    sendMessage(
                      `${
                        message.sender.dliveUsername
                      } has entered the giveaway with ${ticketsToPurchase} ticket(s)!`
                    ).catch(err => {
                      delete config.authKey;
                      win.webContents.send('rxConfig', config);
                    });
                  }
                  let newObj = {};
                  newObj[commandName] = giveaway;
                  if (giveaway === giveaways[commandName]) return;
                  win.webContents.send(
                    'rxGiveaways',
                    Object.assign({}, giveaways, newObj)
                  );
                } else {
                  sendMessage(
                    `${
                      message.sender.dliveUsername
                    } you do not have enough points for that!`
                  ).catch(err => {
                    delete config.authKey;
                    win.webContents.send('rxConfig', config);
                  });
                }
              });
            }
          });
        }
      }
    });
  };

  const rxLemons = new BehaviorSubject(null);
  const rxIcecreams = new BehaviorSubject(null);
  const rxDiamonds = new BehaviorSubject(null);
  const rxNinjaghini = new BehaviorSubject(null);
  const rxNinjet = new BehaviorSubject(null);

  const sendMessageToDlive = ({ reply, config }) => {
    rxDlive
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(dlive => {
        dlive.sendMessage(reply, config.streamerDisplayName).catch(err => {
          delete config.authKey;
          win.webContents.send('rxConfig', config);
        });
      });
  };

  rxLemons
    .pipe(filter(x => !isEmpty(x)))
    .pipe(debounce(() => timer(1000)))
    .subscribe(sendMessageToDlive);
  rxIcecreams
    .pipe(filter(x => !isEmpty(x)))
    .pipe(debounce(() => timer(1000)))
    .subscribe(sendMessageToDlive);
  rxDiamonds
    .pipe(filter(x => !isEmpty(x)))
    .pipe(debounce(() => timer(1000)))
    .subscribe(sendMessageToDlive);
  rxNinjaghini
    .pipe(filter(x => !isEmpty(x)))
    .pipe(debounce(() => timer(1000)))
    .subscribe(sendMessageToDlive);
  rxNinjet
    .pipe(filter(x => !isEmpty(x)))
    .pipe(debounce(() => timer(1000)))
    .subscribe(sendMessageToDlive);

  const replies = (message, config) => {
    let reply;
    rxConfig.pipe(first()).subscribe(config => {
      let eventConfig = Object.assign(
        {},
        {
          enableEventMessages: false,
          enableDebounceEvents: true,
          onFollow: 'Thank you for the follow $USER!',
          onSub: 'Thank you for subscribing, $USER!',
          onGiftedSub: 'Thank you for gifting a sub, $USER!',
          onLemon: '',
          onIcecream: "I'm gonna get a brainfreeze because of you $USER!",
          onDiamond: 'Ooo shiny 💎 thank you, $USER!',
          onNinja: '*smoke bomb* Thanks for that Ninjaghini $USER!',
          onNinjet: "Holy smokes! You're the best $USER! 😲"
        },
        config.eventConfig
      );
      if (!eventConfig.enableEventMessages) return;
      if (message.type === 'Follow') {
        reply = eventConfig.onFollow.replace(
          '$USER',
          message.sender.dliveUsername
        );
      } else if (message.type === 'Subscription') {
        reply = eventConfig.onSub.replace(
          '$USER',
          message.sender.dliveUsername
        );
      } else if (message.type === 'GiftSub') {
        reply = eventConfig.onGiftedSub.replace(
          '$USER',
          message.sender.dliveUsername
        );
      } else if (message.type === 'Gift') {
        let type = message.gift;
        if (type === 'LEMON') {
          reply = eventConfig.onLemon.replace(
            '$USER',
            message.sender.dliveUsername
          );
          if (eventConfig.enableDebounceEvents)
            return rxLemons.next({ reply, config });
        } else if (type === 'ICE_CREAM') {
          reply = eventConfig.onIcecream.replace(
            '$USER',
            message.sender.dliveUsername
          );
          if (eventConfig.enableDebounceEvents)
            return rxIcecreams.next({ reply, config });
        } else if (type === 'DIAMOND') {
          reply = eventConfig.onDiamond.replace(
            '$USER',
            message.sender.dliveUsername
          );
          if (eventConfig.enableDebounceEvents)
            return rxDiamonds.next({ reply, config });
        } else if (type === 'NINJAGHINI') {
          reply = eventConfig.onNinja.replace(
            '$USER',
            message.sender.dliveUsername
          );
          if (eventConfig.enableDebounceEvents)
            return rxNinjaghini.next({ reply, config });
        } else if (type === 'NINJET') {
          reply = eventConfig.onNinjet.replace(
            '$USER',
            message.sender.dliveUsername
          );
          if (eventConfig.enableDebounceEvents)
            return rxNinjet.next({ reply, config });
        }
      }
      if (!reply) return;
      sendMessageToDlive({ reply, config });
    });
  };

  const onNewMsg = (message, streamerDisplayName, config) => {
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

      win.webContents.send('newdonation', {
        message,
        inLino: message.inLino
      });

      let username = message.sender.blockchainUsername;

      rxUsers.pipe(first()).subscribe(users => {
        let Users = Object.assign({}, users);
        if (!Users[username]) {
          Users[username] = {
            points: 0,
            avatar: message.sender.avatar,
            dliveUsername: message.sender.dliveUsername,
            lino: 0,
            blockchainUsername: username,
            role: message.roomRole
          };
        }
        Users[username].lino =
          (Users[username].lino ? Users[username].lino : 0) +
          inLino(message.gift, message.amount);
        rxUsers.next(Users);
      });
    }
    /*if (message.type === 'Message') {
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
    }*/

    wss.broadcast(
      JSON.stringify({
        type: 'message',
        value: message
      })
    );
    textMessage(message, streamerDisplayName);
    keepActive(message);
    replies(message, config);
    win.webContents.send('newmessage', { message });
    let content = message.content;
    if (message.type === 'Gift') {
      console.log('____ NEW GIFT ____');
      rxUsers.pipe(first()).subscribe(users => {
        console.log('GOT USERS');
        let user = Object.assign({}, users[message.sender.blockchainUsername]);
        if (Object.keys(user).length === 0)
          return console.log('USER NOT FOUND');
        rxConfig
          .pipe(
            filter(x => !!x.authKey),
            first()
          )
          .subscribe(config => {
            console.log('GOT CONFIG!');
            let donationSettings = Object.assign(
              {},
              {
                diamond: 100,
                icecream: 10,
                lemons: 1,
                ninja: 1000,
                ninjet: 10000
              },
              config.donationSettings
            );
            let amount =
              message.gift === 'LEMON'
                ? donationSettings.lemons
                : message.gift === 'ICE_CREAM'
                ? donationSettings.icecream
                : message.gift === 'DIAMOND'
                ? donationSettings.diamond
                : message.gift === 'NINJAGHINI'
                ? donationSettings.ninja
                : message.gift === 'NINJET'
                ? donationSettings.ninjet
                : 1 * parseInt(message.amount);
            user.points += amount;
            let wrapper = {};
            wrapper[message.sender.blockchainUsername] = user;
            setRxUsers.next(Object.assign({}, users, wrapper));
          });
      });
    }
    if (message.type === 'Message') {
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
        rxDlive
          .pipe(
            filter(x => !!x),
            first()
          )
          .subscribe(dlive => {
            dlive.listenToChat(config.streamerDisplayName).then(messages => {
              subscriber = messages.subscribe(message => {
                WS.send(JSON.stringify(message));
              });
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
        rxDlive
          .pipe(
            filter(x => !!x),
            first()
          )
          .subscribe(dlive => {
            rxConfig.pipe(first()).subscribe(config => {
              dlive
                .sendMessage(msg.value, config.streamerDisplayName)
                .catch(err => {
                  delete config.authKey;
                  win.webContents.send('rxConfig', config);
                });
            });
          });
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
      }
    });
    if (!config.authKey || config.authKey === '')
      return WS.send(JSON.stringify({ type: 'key_init' }));
  });

  let oldListeners = [];
  let oldDlive = null;
  let msgListener = null;
  // This is for the app
  rxConfig
    .pipe(
      filter(x => !!x.authKey && !!x.streamerDisplayName),
      distinctUntilChanged((prev, curr) => {
        return (
          prev.authKey === curr.authKey &&
          prev.streamerDisplayName === curr.streamerDisplayName
        );
      })
    )
    .subscribe(config => {
      if (oldDlive) {
        oldListeners.forEach(listener => listener.unsubscribe());
      }
      let dliveListen = rxDlive
        .pipe(
          filter(x => !!x),
          first()
        )
        .subscribe(dlive => {
          console.log('GOT DLIVE');
          dlive
            .listenToChat(config.streamerDisplayName)
            .then(messages => {
              console.log('GOT RX OBJECT', config.streamerDisplayName);
              oldListeners.push(
                messages.subscribe(message => {
                  console.log('GOT NEW MESSAGE', message);
                  onNewMsg(message, config.streamerDisplayName, config);
                })
              );
            })
            .catch(err => {
              console.log('GOT ERR IN LISTEN TO CHAT', err);
            });
          dlive.getChannel(config.streamerDisplayName).then(channel => {
            console.log('SUBSCRIBING TO RXLIVESTREAM HERE');
            channel.rxLivestream.subscribe(livestream => {
              if (!livestream) return;
              if (typeof livestream === 'object') {
                if (Object.keys(livestream).length === 0) return;
                win.webContents.send('livestreamObject', livestream);
              }
            });
          });
        });
      oldListeners.push(dliveListen);
      oldDlive = dliveListen;
    });
}

ipcMain.on('sendmessage', (event, { from, message }) => {
  console.log('SENDING MSG');
  if (config.authKey != null || config.username != null) {
    rxDlive.pipe(first()).subscribe(dlive => {
      dlive.sendMessage(message, config.streamerDisplayName).catch(err => {
        console.log('SEND MESSAGE FAILED');
        delete config.authKey;
        win.webContents.send('rxConfig', config);
      });
    });
  } else {
    var bannerMessage = {
      needsBanner: true,
      message:
        "Can't Connect to Dlive because You may have not correctly entered a Username and Auth Key",
      type: 'error',
      alertType: 'alert'
    };

    event.sender.send('show-bannermessage', [bannerMessage]);
  }
});

app.on('ready', createWindow);
