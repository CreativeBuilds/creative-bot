const { BehaviorSubject } = require('rxjs');
const storage = require('electron-json-storage');

let rxConfig = new BehaviorSubject({});

storage.get('config', (err, data) => {
  if (err) throw err;
  data.init = true;
  // if (!data.commandPrefix) data.commandPrefix = '!';

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
