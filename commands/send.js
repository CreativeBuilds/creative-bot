const sendLino = require('../helpers/sendLino');
const { tryRequireFromStorage } = require('../helpers');
const config = tryRequireFromStorage('../config');
const run = ({ message, args }) => {
  // List all commands by default, if someone does !help commandName then show details on that command
  if (
    message.sender.username !== 'creativebuilds' &&
    message.sender.username !== config.streamer
  )
    return Promise.resolve(`You don't have permission to run that command!`);
  let amount = Math.floor(args[1]);
  let user = args[2];
  if (!user)
    return Promise.resolve(`Please input a user and number! ex: !send 10 user`);
  if (isNaN(amount))
    return Promise.resolve(`Please input a number! ex: !send 10 user`);
  return sendLino(args[2], 1)
    .then(v => {
      return Promise.resolve(
        `Transfer completed! block: ${v.height} sent ${amount} to ${user}`
      );
    })
    .catch(err => {
      console.error(err);
      return Promise.resolve('An error has occured!');
    });
};

module.exports = {
  name: 'send',
  run: run,
  description: 'sends lino to a user',
  permissions: {
    everyone: true
  }
};
