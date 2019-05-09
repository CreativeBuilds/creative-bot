const rxTimers = require('./rxTimers');
const rxConfig = require('./rxConfig');
const sendMessage = require('./sendMessage');
const { filter, first } = require('rxjs/operators');
const DLive = require('dlive-js');

let intervals = {};
const messages = [];

let timerMap = {};

let oldTimers = {};

let listeners = [];

module.exports = {
  run: () => {
    rxTimers.subscribe(timers => {
      if (timers === oldTimers) return;
      if (Object.keys(timers).length === 0) {
        Object.keys(intervals).forEach(key => clearInterval(intervals[key]));
      }
      if (listeners.length) {
        listeners.forEach(listener => listener.unsubscribe());
        Object.keys(intervals).forEach(key => clearInterval(intervals[key]));
        intervals = [];
      }
      listeners.push(
        rxConfig
          .pipe(
            filter(x => !!x.authKey),
            first()
          )
          .subscribe(config => {
            let dlive = new DLive({ authKey: config.authKey });

            dlive.listenToChat(config.streamerDisplayName).then(Messages => {
              listeners.push(
                Messages.subscribe(message => {
                  Object.keys(intervals).forEach(key => {
                    let intervalObj = intervals[key];
                    intervalObj.messages.push(Date.now());
                  });
                })
              );
            });
          })
      );
      Object.keys(timers).forEach(key => {
        const run = () => {
          let timer = timers[key];
          if (!timer.enabled) return;
          let messages = [];
          intervals[key] = {
            messages: messages,
            timer: setInterval(() => {
              let now = Date.now(); // Push adds to the back of the array
              let minMsgs = timer.messages;
              if (!timerMap[timer.name] || minMsgs === 0) {
                timerMap[timer.name] = now;
                return sendMessage(timer.reply);
              }
              if (messages.length < minMsgs) return;
              if (
                now - messages[messages.length - (minMsgs - 1)] >
                (timer.seconds || 600) * 1000
              ) {
                timerMap[timer.name] = now;
                return sendMessage(timer.reply);
              }
            }, 1000 * (timer.seconds || 600))
          };
        };
        if (intervals[key]) {
          if (JSON.stringify(timers[key]) !== JSON.stringify(oldTimers[key])) {
            clearInterval(intervals[key].timer);
            return run();
          }
        } else {
          run();
        }
      });
      Object.keys(intervals).forEach(key => {
        if (!timers[key]) clearInterval(intervals[key].timer);
      });
      oldTimers = timers;
    });
  }
};
