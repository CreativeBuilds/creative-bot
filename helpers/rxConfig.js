const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxConfig = new BehaviorSubject({});

storage.get('config', (err, data) => {
  if (err) throw err;
  data.init = true;
  if (!data.commandPrefix) data.commandPrefix = '!';

  // Set default points to 5, and if it's a string, set it to be a number
  if (!data.points || isNaN(Number(data.points))) data.points = 5;
  // Defaults to 5 minutes
  if (!data.pointsTimer || isNaN(Number(data.pointsTimer)))
    data.pointsTimer = 300;

  rxConfig.next(data);
  rxConfig.subscribe(data => {
    data.points = Number(data.points);
    data.pointsTimer = Number(data.pointsTimer);
    storage.set('config', data);
  });
});

module.exports = rxConfig;
