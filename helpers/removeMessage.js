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
  }
};
