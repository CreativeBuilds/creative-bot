const rxUsers = require('../helpers/rxUsers');
const { filter } = require('rxjs/operators');
const moment = require('moment');
module.exports = {
  name: 'uptime',
  function: ({ message, streamChannel }) => {
    return new Promise((res, rej) => {
      if (!streamChannel || !streamChannel.getUptime) res('null');
      streamChannel.getUptime().then(seconds => {
        if (!seconds) res(`OFFLINE`);
        let duration = moment.duration(seconds, 'seconds');
        // console.log('DURATION', duration);
        let format = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        res(`${format}`);
      });
    });
  }
};
