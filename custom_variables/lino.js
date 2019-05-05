const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');

module.exports = {
  name: 'lino',
  function: ({ message }) => {
    return new Promise((res, rej) => {
      res(message.sender.getLinoBalance());
    });
  }
};
