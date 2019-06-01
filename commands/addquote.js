let rxQuotes = require('./../helpers/rxQuotes.js');
const { first } = require('rxjs/operators');
const storage = require('electron-json-storage');
var _ = require('lodash');

const run = ({ message, args }) => {
    // List all commands by default, if someone does !help commandName then show details on that command
    return new Promise((res, rej) => {

        if (message.roomRole === 'Owner' || message.roomRole === 'Moderator') {
            if (args[1] !== 'help') {
                var data = args;
                var msg = '';
                var quotedBy = args[args.length - 1];
                data.splice(0, 1);
                data.splice((data.length - 1), 1);

                for(var i = 0; i < data.length; i++) {
                    if (i < data.length - 1) {
                        msg += data[i] + ' '
                    } else {
                        msg += data[i]
                    }
                }


                if (msg.includes('"')) {
                    var msgString = msg.replace('"', '').replace('"', '');

                    if (msgString.length <= 90) {

                        rxQuotes.pipe(first()).subscribe(quotes => {
                            if (message.length === 0) return;
                            let Quotes = Object.assign({}, quotes);

                            var today = new Date();
                            var dd = String(today.getDate()).padStart(2, '0');
                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                            var yyyy = today.getFullYear();

                            today = dd + '/' + mm + '/' + yyyy;

                            var quoteId =  Quotes['quotes'].length;
                        
                            Quotes['quotes'].push({
                                quoteId: quoteId,
                                quote: msgString,
                                quoteBy: quotedBy,
                                event: "DLive",
                                date: today
                            });

                            if (Quotes !== quotes) {
                                quotes = Quotes;
                                storage.set('quotes', Quotes);
                            }
                        
                            return res(`@${message.sender.dliveUsername}: Quote has been Saved to Quotes List`);
                        });
                    } else {
                        return res(`@${message.sender.dliveUsername}: Quote Message is Longer Than 90 Characters`);
                    }
                } else {
                    return res(`@${message.sender.dliveUsername}: Please put Quotations(") before and After the Quote Message`);
                }
            } else {
                return res(`@${message.sender.dliveUsername}: !aq [quoteMessage <= 96 Characters] [user <= 20 Characters] - user without the '@'`);
            }
        } else {
            return res(`@${message.sender.dliveUsername}: You do not have permission to use this command`);
        }
    });
}

module.exports = {
    name: 'aq',
    run: run,
    description: 'Adds a Quote by Streamer or anyone who has made a notiable comment',
    permissions: {
        everyone: true
    }
};