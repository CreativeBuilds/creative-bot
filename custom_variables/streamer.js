const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');

module.exports = {
  name: 'streamer',
  function: ({ streamChannel }) => {
    return new Promise((res, rej) => {
      res(streamChannel.dliveUsername || 'null');
    });
  }
};
