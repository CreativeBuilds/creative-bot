const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxGiveaway = new BehaviorSubject({});

storage.get('giveaways', (err, data) => {
  if (err) throw err;
  rxGiveaway.next(data);
  rxGiveaway.subscribe(data => {
    storage.set('giveaways', data);
  });
});

module.exports = rxGiveaway;
