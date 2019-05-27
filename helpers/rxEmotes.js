const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxEmotes = new BehaviorSubject({});

storage.get('emotes', (err, data) => {
    if (err) throw err;
    rxEmotes.next(data);
    rxEmotes.subscribe(data => {
        storage.set('emotes', data);
    });
});
  
module.exports = rxEmotes;