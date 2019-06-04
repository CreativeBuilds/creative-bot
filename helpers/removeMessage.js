const sendRequestToDlive = require('./sendRequestToDlive');
const rxConfig = require('./rxConfig');
const { first } = require('rxjs/operators');

module.exports = {
  removeMessage: (id, streamer) => {
    return sendRequestToDlive({
      operationName: 'DeleteChat',
      query: `mutation DeleteChat($streamer: String!, $id: String!) {
                        chatDelete(streamer: $streamer, id: $id) {
                          err {
                            code
                            message
                            __typename
                          }
                          __typename
                        }
                      }
                      `,
      variables: {
        streamer,
        id
      }
    });
  },
  timeoutUser: (id, streamer, amount = 5) => {
    return sendRequestToDlive({
      operationName: 'UserTimeoutSet',
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            '89453f238a70a36bedaa2cb24ef75d8bdef09506dc5b17ba471530ce4c73254b'
        }
      },
      variables: {
        duration: amount,
        streamer,
        username: id
      }
    }).catch(console.error);
  },
  muteUser: (id, streamer) => {
    return sendRequestToDlive({
      operationName: 'BanStreamChatUser',
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            '4eaeb20cba25dddc95df6f2acf8018b09a4a699cde468d1e8075d99bb00bacc4'
        }
      },
      variables: {
        streamer,
        username: id
      }
    }).catch(console.error);
  }
};
