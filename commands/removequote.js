let rxQuotes = require('./../helpers/rxQuotes.js');
const { first } = require('rxjs/operators');
 
var _ = require('lodash');

const run = ({ message, args }) => {
  // List all commands by default, if someone does !help commandName then show details on that command
  return new Promise((res, rej) => {
    if (message.roomRole === 'Owner' || message.roomRole === 'Moderator') {
      if (args[1] !== 'help') {
        rxQuotes.pipe(first()).subscribe(quotes => {
          var id = Number(args[1]);
          let Quotes = Object.assign({}, quotes);

          if (Quotes[id]) {
            delete Quotes[id];

            if (Quotes !== quotes) {
              quotes = Quotes;
              rxQuotes.next(quotes);
            }

            return res(
              `@${
                message.sender.dliveUsername
              }: The Quote was successfully removed`
            );
          } else {
            return res(
              `@${
                message.sender.dliveUsername
              }: The Quote you was trying to find and remove does not exist`
            );
          }
        });
      } else {
        return res(
          `@${message.sender.dliveUsername}: Put a number after the command it 
                    will remove selected quote`
        );
      }
    } else {
      return res(
        `@${
          message.sender.dliveUsername
        }: You do not have permission to use this command`
      );
    }
  });
};

module.exports = {
  name: 'removequote',
  run: run,
  description:
    'Adds a Quote by Streamer or anyone who has made a notiable comment',
  permissions: {
    everyone: true
  }
};
