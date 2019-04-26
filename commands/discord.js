let config = {};
const rxConfig = require('../helpers/rxConfig');
rxConfig.subscribe(data => (config = data));

const run = () => {
  return Promise.resolve(`Join us on discord here: ${config.discordInvite}`);
};

module.exports = {
  name: 'discord',
  run: run,
  description: 'Posts a link to the discord',
  permissions: {
    everyone: true
  }
};
