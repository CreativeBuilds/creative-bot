const rxCommands = require('./rxCommands');

const makeNewCommand = ({ commandName, commandReply, commands }) => {
  if (commands[commandName]) return Promise.reject('Command Already Exists!');
  let Commands = Object.assign({}, commands);
  Commands[commandName] = {
    name: commandName,
    dateCreated: Date.now(),
    reply: commandReply,
    uses: 0,
    permissions: {}
  };
  return rxCommands.next(Commands);
};

module.exports = makeNewCommand;
