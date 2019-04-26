const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');
const { filter } = require('rxjs/operators');
const _ = require('lodash');

let rxConfig = new BehaviorSubject({});

storage.get('config', (err, data) => {
  if (err) throw err;
  data.init = true;
  if (!data.commandPrefix) data.commandPrefix = '!';
  if (!data.points) data.points = 5;
  rxConfig.next(data);
  rxConfig.subscribe(data => {
    storage.set('config', data);
  });
});

module.exports = rxConfig;
