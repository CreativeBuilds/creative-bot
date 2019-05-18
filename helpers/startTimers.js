const rxTimers = require('./rxTimers');
const rxConfig = require('./rxConfig');
const sendMessage = require('./sendMessage');
const { filter, first, distinctUntilChanged } = require('rxjs/operators');
const DLive = require('dlive-js');
const _ = require('lodash');

let oldTimers = {};

let allRunningTimers = {};

class Timer {
  constructor(timer, key) {
    this.messages = [];
    this.lastSent = 0;
    this.minMsgs = timer.messages;
    this.reply = timer.reply;
    this.name = key;
    this.timerObj = timer;
    this.seconds = (timer.seconds || 600) * 1000;
    this.timer = setInterval(() => {
      let now = Date.now(); // Push adds to the back of the array
      let minMsgs = this.minMsgs;

      // IF Minamount of msgs has passed
      // Then check if amount of time has passed

      if (minMsgs === 0 || this.lastSent === 0) {
        return this.send();
      }
      if (this.messages.length > minMsgs) {
        let last = this.messages[this.messages.length - 1];
        // Takes current date and subtracts ms date of oldest message in array and checks to see if enough time has passed
        if (now - last > this.seconds) {
          return this.send();
        }
      }
    }, 1000 * (timer.seconds || 600));
  }

  send() {
    this.lastSent = Date.now();
    this.messages = [];
    sendMessage(this.reply);
  }
}

module.exports = {
  run: () => {
    rxTimers.pipe(distinctUntilChanged()).subscribe(timers => {
      let determineWhichChanged = () => {
        // Compare timers with oldTimers to see if something exists
        // The object that is returned will be which timers to create in an array of strings
        return Object.keys(timers).reduce((acc, key) => {
          let oldTimer = oldTimers[key];
          if (!oldTimer) {
            acc.push(key);
            return acc;
          } else if (!_.isEqual(oldTimer, timers[key])) {
            acc.push(key);
            return acc;
          }
          return acc;
        }, []);
      };
      Object.keys(allRunningTimers)
        .reduce((acc, key) => {
          if (!timers[key]) acc.push(key);
          return acc;
        }, [])
        .forEach(key => {
          let timer = allRunningTimers[key];
          clearInterval(timer.timer);
          delete allRunningTimers[key];
        });
      let changed = determineWhichChanged();
      changed.forEach(key => {
        let timer = timers[key];
        if (allRunningTimers[key]) {
          clearInterval(allRunningTimers[key].timer);
          delete allRunningTimers[key];
        }
        if (!timer.enabled) return;
        // generate a new timer
        allRunningTimers[key] = new Timer(timer, key);
      });
      oldTimers = timers;
    });
  }
};
