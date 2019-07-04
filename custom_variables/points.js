const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');

module.exports = {
  name: 'points',
  function: ({ message }) => {
    return new Promise((res, rej) => {
      rxUsers.pipe(filter(x => !!x)).subscribe(users => {
        // if (!users[message.sender.blockchainUsername]) res(null);
        try {
          res(users[message.sender.blockchainUsername].points);
        } catch (err) {
          console.error(err);
          res(0);
        }
      });
    });
  }
};
