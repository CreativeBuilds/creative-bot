const SaveCommands = require('./SaveCommands');

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
  return SaveCommands(Commands);
};

module.exports = makeNewCommand;
