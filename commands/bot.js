const run = () => {
  // List all commands by default, if someone does !help commandName then show details on that command
  return Promise.resolve(
    `Chat bot created by CreativeBuilds, check the source code out here! https://github.com/creativebuilds/creative-bot`
  );
};

module.exports = {
  name: 'bot',
  run: run,
  description: 'Posts a link to the repo of this bot.',
  permissions: {
    everyone: true
  }
};
