const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxQuotes = new BehaviorSubject({});

storage.get('quotes', (err, data) => {
    if (err) throw err;

    // Set default points to 5, and if it's a string, set it to be a number
    if (!data.quotes) data.quotes = [];

    rxQuotes.next(data);
    rxQuotes.subscribe(data => {
        data.quotes = data.quotes;
        storage.set('quotes', data);
    });
});
  
module.exports = rxQuotes;