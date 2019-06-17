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
  // Defaults to Dark Theme 'dark'
  if (!data.themeType) data.themeType = 'dark';
  // Defaults to true
  if (!data.enableEvents) data.enableEvents = true;
  // Defaults to true
  if (!data.enableStickers) data.enableStickers = true;
  // Defaults to true
  if (!data.enableStickersAsText) data.enableStickersAsText = false;
  // Defaults to true
  if (!data.enableTimestamps) data.enableTimestamps = true;
  // Defaults to true
  if (!data.enableTimestampsAsDigital) data.enableTimestampsAsDigital = true;

  rxConfig.next(data);
  rxConfig.subscribe(data => {
    data.points = Number(data.points);
    data.pointsTimer = Number(data.pointsTimer);
    data.themeType = String(data.themeType);
    data.enableEvents = Boolean(data.enableEvents);
    data.enableStickers = Boolean(data.enableStickers);
    data.enableStickersAsText = Boolean(data.enableStickersAsText);
    data.enableTimestamps = Boolean(data.enableTimestamps);
    data.enableTimestampsAsDigital = Boolean(data.enableTimestampsAsDigital);
    storage.set('config', data);
  });
});

module.exports = rxConfig;
