let rxQuotes = require('./../helpers/rxQuotes.js');
const { first } = require('rxjs/operators');
const storage = require('electron-json-storage');
var _ = require('lodash');

const run = ({ message, args }) => {
    // List all commands by default, if someone does !help commandName then show details on that command
    return new Promise((res, rej) => {

        if (message.roomRole != 'member') {
            rxQuotes.pipe(first()).subscribe(quotes => {
                var id = Number(args[1]);
                let Quotes = Object.assign({}, quotes);

                if (id <= (Quotes['quotes'].length - 1)) {
                    Quotes['quotes'].splice(id, 1);

                    if (Quotes !== quotes) {
                        quotes = Quotes;
                        storage.set('quotes', Quotes);
                    }

                    return res(`@${message.sender.dliveUsername}: The Quote was successfully removed`);

                } else {
                    return res(`@${message.sender.dliveUsername}: The Quote you was trying to find and remove does not exist`);
                }
            });
        }
    });
}

module.exports = {
    name: 'removequote',
    run: run,
    description: 'Adds a Quote by Streamer or anyone who has made a notiable comment',
    permissions: {
        everyone: true
    }
};