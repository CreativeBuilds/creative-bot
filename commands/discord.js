const config = require('../config');

const run = () => {
    return Promise.resolve(`Join us on discord here: ${config.discordInvite}`)
}

module.exports = {
    "name": "discord",
    "run": run,
    "description": "Posts a link to the discord",
    "permissions": {
        "everyone": true
    }
}