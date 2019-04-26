const getLivestreamChatroomInfo = require('./getLivestreamChatroomInfo');

module.exports = dliveUsername => {
  return getLivestreamChatroomInfo(dliveUsername).then(user => {
    try {
      return JSON.parse(user).data.userByDisplayName.username;
    } catch (err) {
      return '';
    }
  });
};
