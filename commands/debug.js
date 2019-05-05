const pack = require('../package.json');
let config = {};
const rxConfig = require('../helpers/rxConfig');
const fs = require('fs');
rxConfig.subscribe(data => (config = data));
const run = ({ message, args }) => {
  // List all commands by default, if someone does !help commandName then show details on that command
  if (
    message.sender.username !== 'creativebuilds' &&
    message.sender.username !== config.streamer
  )
    return Promise.resolve(`You don't have permission to run that command!`);
  return Promise.resolve(`Current bot version ${pack.version}`);
};

module.exports = {
  name: 'debug',
  run: run,
  description: 'provides the bots current version',
  permissions: {
    everyone: true
  }
};
