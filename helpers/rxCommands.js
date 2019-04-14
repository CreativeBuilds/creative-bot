const { BehaviorSubject } = require('rxjs');

let tryRequireFromStorage = path => {
  try {
    return require(path);
  } catch (err) {
    return {};
  }
};

const commands = tryRequireFromStorage('../storage/commands.json');

// This creates a new B.S. which allows us to listen to this node and make changes whenever and whereever we want
const rxCommands = new BehaviorSubject(commands);

module.exports = rxCommands;
