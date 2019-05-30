const rxQuotes = require('../helpers/rxQuotes');
const { filter } = require('rxjs/operators');

module.exports = {
  name: 'quote',
  function: ({ message }) => {
    return new Promise((res, rej) => {
      //res(message.sender.dliveUsername);
    });
  }
};