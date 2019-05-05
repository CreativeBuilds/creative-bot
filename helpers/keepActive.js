let users = {};
let rxConfig = require('./rxConfig');
const { filter, first } = require('rxjs/operators');

let activeUsers = {};
const rxUsers = require('./rxUsers');

rxUsers.subscribe(data => {
  users = data;
});
let ticker;

// Every 5 minutes this interval will run
rxConfig.pipe(filter(x => x.points && x.pointsTimer)).subscribe(config => {
  if (ticker) {
    clearInterval(ticker);
  }
  console.log('GOT CONFIG', config.pointsTimer);
  ticker = setInterval(() => {
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
        users[username] = storageUser;
      });
      rxUsers.next(users);
    }
    activeUsers = {};
  }, 1000 * config.pointsTimer);
});
const keepActive = message => {
  activeUsers[message.sender.blockchainUsername] = message;
};

module.exports = keepActive;
