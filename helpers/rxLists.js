const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');
const { filter } = require('rxjs/operators');
const _ = require('lodash');

let rxLists = new BehaviorSubject({});

storage.get('lists', (err, data) => {
  if (err) throw err;
  rxLists.next(data);
  rxLists.subscribe(data => {
    storage.set('lists', data);
  });
});

module.exports = rxLists;
