const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');
const _ = require('lodash');
const { filter } = require('rxjs/operators');

let rxUsers = new BehaviorSubject({});

storage.get('users', (err, data) => {
  if (err) throw err;
  rxUsers.next(data);
  rxUsers.pipe(filter(x => !_.isEmpty(x))).subscribe(data => {
    storage.set('users', data);
  });
});

module.exports = rxUsers;
