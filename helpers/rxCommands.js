const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');
const { filter } = require('rxjs/operators');
const _ = require('lodash');

let rxCommands = new BehaviorSubject({});

storage.get('commands', (err, data) => {
  if (err) throw err;
  rxCommands.next(data);
  rxCommands.subscribe(data => {
    storage.set('commands', data);
  });
});

module.exports = rxCommands;
