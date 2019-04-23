const getLivestreamChatroomInfo = require('./getLivestreamChatroomInfo');

module.exports = dliveUsername => {
  return getLivestreamChatroomInfo(dliveUsername).then(user => {
    return JSON.parse(user).data.userByDisplayName.username;
  });
};
