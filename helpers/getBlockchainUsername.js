const getLivestreamChatroomInfo = require('./getLivestreamChatroomInfo');

module.exports = (dliveUsername, config = null) => {
  return getLivestreamChatroomInfo(dliveUsername, config).then(user => {
    try {
      return JSON.parse(user).data.userByDisplayName.username;
    } catch (err) {
      return '';
    }
  });
};
