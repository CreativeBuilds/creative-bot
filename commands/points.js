let rxUsers = require('../helpers/rxUsers');
const { first } = require('rxjs/operators');
const run = ({ message, args }) => {
  return new Promise((res, rej) => {
    rxUsers.pipe(first()).subscribe(users => {
      // TODO in dlive-js format username will be blockchainUsername
      let username = message.sender.blockchainUsername;
      return res(
        `${message.sender.dliveUsername}, you have ${
          users[username] ? users[username].points : 0
        } point${
          users[username]
            ? users[username].points > 1 || users[username].points === 0
              ? 's'
              : ''
            : 's'
        }`
      );
    });
  });
};

module.exports = {
  name: 'points',
  run: run,
  description: 'gets the users points',
  permissions: {
    everyone: true
  }
};
