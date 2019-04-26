// This file is used for the bot sending out lino to users due to safety reasons it can be completely disabled with an options setting in config.js
const tryRequireFromStorage = require('./tryRequireFromStorage');
const getLivestreamChatroomInfo = require('./getLivestreamChatroomInfo');
let config = {};
const rxConfig = require('../helpers/rxConfig');
rxConfig.subscribe(data => (config = data));
const sendRequestToDlive = require('./sendRequestToDlive');
const { lino } = require('./lino');
const getBlockchainUsername = require('./getBlockchainUsername');

// TODO add options toggle setting

module.exports = (
  username,
  amount,
  memo = 'github.com/CreativeBuilds/dlive-chat-bot'
) => {
  return lino.query.getAccountBank(config.senderUsername).then(v => {
    console.log(
      `Transfering: ${amount} from ${config.senderUsername} to ${username}`
    );
    if (v.saving.amount < Number(amount)) return 'Error, not enough funds!';
    return getBlockchainUsername(username).then(receiver => {
      let sender = config.senderUsername;
      return lino.query.getSeqNumber(sender).then(seq => {
        return lino.broadcast.transfer(
          sender,
          receiver,
          Number(amount),
          memo,
          config.privKeyHex,
          seq
        );
      });
    });
  });
};
