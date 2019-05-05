const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');

module.exports = {
  name: 'user',
  function: ({ message }) => {
    return new Promise((res, rej) => {
      res(message.sender.dliveUsername);
    });
  }
};
