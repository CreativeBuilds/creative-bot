const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');
let rxTimers = new BehaviorSubject({});

storage.get('timers', (err, data) => {
  if (err) throw err;
  rxTimers.next(data);
  rxTimers.subscribe(data => {
    storage.set('timers', data);
  });
});

module.exports = rxTimers;
