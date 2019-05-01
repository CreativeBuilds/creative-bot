const rxTimers = require('./rxTimers');
const { messages$, input$ } = require('./rxChat');
const sendMessage = require('./sendMessage');

let intervals = {};
const messages = [];

let timerMap = {};

let oldTimers = {};

rxTimers.subscribe(timers => {
  if (timers === oldTimers) return;
  if (Object.keys(timers).length === 0) {
    Object.keys(intervals).forEach(key => clearInterval(intervals[key]));
  }
  messages$.subscribe(data => {
    // Check if the message came from the bot

    if (data.type === 'data') {
      messages.push(Date.now());
      //   TODO add max length to messages
    }
  });
  Object.keys(timers).forEach(key => {
    const run = () => {
      let timer = timers[key];
      if (!timer.enabled) return;
      intervals[key] = setInterval(() => {
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
      }, 1000 * (timer.seconds || 600));
    };
    if (intervals[key]) {
      if (JSON.stringify(timers[key]) !== JSON.stringify(oldTimers[key])) {
        clearInterval(intervals[key]);
        return run();
      }
    } else {
      run();
    }
  });
  Object.keys(intervals).forEach(key => {
    if (!timers[key]) clearInterval(intervals[key]);
  });
  oldTimers = timers;
});

module.exports = rxTimers;
