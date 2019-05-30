const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxQuotes = new BehaviorSubject({});

storage.get('quotes', (err, data) => {
    if (err) throw err;
    rxQuotes.next(data);
    rxQuotes.subscribe(data => {
        storage.set('quotes', data);
    });
});
  
module.exports = rxQuotes;