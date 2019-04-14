const SaveToJson = require('./SaveToJson');

const saveCommands = commands => {
  SaveToJson('/storage/commands.json', commands);
  return Promise.resolve(commands);
};

module.exports = saveCommands;
