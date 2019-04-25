let tryRequireFromStorage = path => {
  try {
    return require(path);
  } catch (err) {
    return {};
  }
};

let users = {};
let config = {};
let rxConfig = require('./rxConfig');
rxConfig.subscribe(data => (config = data));
let activeUsers = {};
const rxUsers = require('./rxUsers');

rxUsers.subscribe(data => {
  users = data;
});

// Every 5 minutes this interval will run
let ticker = setInterval(() => {
  let startUsers = Object.assign({}, users);
  if (Object.keys(activeUsers).length > 0) {
    Object.keys(activeUsers).forEach(username => {
      let storageUser = users[username];
      let user = activeUsers[username].sender;
      if (!storageUser) {
        storageUser = {
          // This will probably change once we add functionaly to edit different tiers of users to get different points
          points: config.points || 5,
          avatar: user.avatar,
          displayname: user.displayname,
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
  // Remove all users from activeUsers
  startUsers = undefined;
  activeUsers = {};
}, 1000 * 10);

const keepActive = message => {
  activeUsers[message.sender.username] = message;
};

module.exports = keepActive;
