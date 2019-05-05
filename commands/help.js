const commands = {};
const fs = require('fs');

fs.readdir(__dirname, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  files.forEach(file => {
    let extensionName = file.substring(file.length - 3);
    if (extensionName === '.js') {
      let command = require(`./${file}`);
      commands[command.name] = command;
    }
  });
});

const run = ({ message, args }) => {
  // List all commands by default, if someone does !help commandName then show details on that command

  if (
    message.sender.username !== 'creativebuilds' &&
    message.sender.username !== config.streamer
  )
    return Promise.resolve(`You don't have permission to run that command!`);
  if (args.length > 1) {
    let info = args[1];
    if (!commands[info])
      return Promise.resolve(
        "The command you're looking to specify, doesn't exist. (case sensitive)"
      );
    return Promise.resolve(`Command !${info}: ${commands[info].description}`);
  } else {
    let text = 'All commands listed: ';
    Object.keys(commands).forEach(name => {
      text += `${name} `;
    });
    text += ' | Check description by !help [commandName]';
    return Promise.resolve(text);
  }
};

module.exports = {
  name: 'help',
  run: run,
  description: "Show's information on commands, and lists all commands.",
  permissions: {
    everyone: true
  }
};
