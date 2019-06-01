let rxQuotes = require('./../helpers/rxQuotes.js');
const { first } = require('rxjs/operators');
var _ = require('lodash');

const run = ({ message, args }) => {
    // List all commands by default, if someone does !help commandName then show details on that command
    return new Promise((res, rej) => {
        var id = Number(args[1]);

        if (args[1] !== 'help') {
            rxQuotes.subscribe(quotes => {

                var quotesArr = quotes['quotes'];

                if (!isNaN(id)) {
                    var quote = quotesArr[id];
                    if (id <= (quotesArr.length -1)) {
                        return res(
                            `Quote ${id.toString()}: '${quote.quote}' - @${quote.quoteBy}  [${quote.date}]`     
                        );
                    } else {
                        return res(`@${message.sender.dliveUsername}: The Quote you was trying to find does not exist`);
                    }
                } else if (args[1] === undefined || args[1] === null) {
                    var index = quotesArr.length;
                    var ranNumb = Number(Math.floor(Math.random() * (index - 0)));
                    var quote = quotesArr[ranNumb];
                    return res(
                        `Quote ${ranNumb.toString()}: '${quote.quote}' - @${quote.quoteBy}  [${quote.date}]`     
                    );
                    
                }
                else {
                    return res(
                        `@${message.sender.dliveUsername}: You Have Entered An Invaild Value` 
                    );
                }
            });
        } else {
            return res(
                `@${message.sender.dliveUsername}: Put a number after the command it 
                will display selected quote if no number then it will pick a random quote` 
            );
        }
    });
  };
  
module.exports = {
    name: 'quote',
    run: run,
    description: 'Posts a Random Quote or if a Number is present it will Post a quote that has that id',
    permissions: {
      everyone: true
    }
};