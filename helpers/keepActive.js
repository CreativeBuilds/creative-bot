let users = {};
let rxConfig = require('./rxConfig');
const { filter, first, tap } = require('rxjs/operators');

let activeUsers = {};
const rxUsers = require('./rxUsers');
const setRxUsers = require('./setRxUsers');

const init = win => {
  console.log('KEEP ACTIVE STARTED');
  rxUsers.subscribe(data => {
    users = data;
  });
  let ticker;

  // Every 5 minutes this interval will run
  rxConfig
    .pipe(
      tap(x => console.log('BEEP BOOP IM A SHEEP', Object.keys(x))),
      filter(x => !!x.points && !!x.pointsTimer)
    )
    .subscribe(config => {
      console.log('got config', !!ticker, config.points, config.pointstimer);
      if (ticker) {
        clearInterval(ticker);
      }
      ticker = setInterval(() => {
        console.log('looping through ticker', activeUsers);
        if (Object.keys(activeUsers).length > 0) {
          Object.keys(activeUsers).forEach(username => {
            let storageUser = users[username];
            let user = activeUsers[username].sender;
            if (!storageUser) {
              storageUser = {
                // This will probably change once we add functionaly to edit different tiers of users to get different points
                points: config.points || 5,
                avatar: user.avatar,
                displayname: user.dliveUsername,
                lino: 0,
                username,
                role: activeUsers[username].roomRole
              };
            } else {
              storageUser = Object.assign({}, storageUser, {
                points: storageUser.points + (config.points || 5)
              });
            }
            win.webContents.send('updateUser', storageUser);
          });
        }
        activeUsers = {};
      }, 1000 * config.pointsTimer);
    });
};

const keepActive = message => {
  if (!message.sender) {
    console.error(message);
  } else {
    activeUsers[message.sender.blockchainUsername] = message;
  }
};

module.exports = { keepActive, init };
