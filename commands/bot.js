const run = () => {
    // List all commands by default, if someone does !help commandName then show details on that command
    return Promise.resolve(`View the bot's source code on GitHub! https://github.com/CreativeBuilds/dlive-chat-bot`)
}

module.exports = {
    "name": "bot",
    "run": run,
    "description": "Posts a link to the repo of this bot.",
    "permissions": {
        "everyone": true
    }
}