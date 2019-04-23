const getLiveChannels = require('../helpers/getLiveChannels');
const { tryRequireFromStorage } = require('../helpers');
const config = tryRequireFromStorage('../config');
const run = ({ message, args }) => {
  // List all commands by default, if someone does !help commandName then show details on that command
  if (
    message.sender.username !== 'creativebuilds' &&
    message.sender.username !== config.streamer
  )
    return Promise.resolve(`You don't have permission to run that command!`);
  return getLiveChannels()
    .then(v => {
      return Promise.resolve(
        `There are currently ~${v.streamers} live with a total of ${
          v.viewers
        } viewers`
      );
    })
    .catch(err => {
      console.error(err);
      return Promise.resolve('An error has occured!');
    });
};

module.exports = {
  name: 'getLive',
  run: run,
  description: 'gets all users',
  permissions: {
    everyone: true
  }
};
