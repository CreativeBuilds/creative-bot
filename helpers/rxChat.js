const { QueueingSubject } = require('queueing-subject');
const { switchMap, retryWhen, delay } = require('rxjs/operators');
const makeWebSocketObservable = require('rxjs-websockets').default;
const WebSocket = require('ws');
const rxConfig = require('./rxConfig');

const getBlockchainUsername = require('./getBlockchainUsername');

const { filter, first } = require('rxjs/operators');

const input$ = new QueueingSubject();

const socket$ = makeWebSocketObservable('wss://graphigostream.prd.dlive.tv', {
  makeWebSocket: (uri, protocols) => {
    let ws = new WebSocket(uri, protocols);
    ws.on('open', function() {
      rxConfig
        .pipe(
          filter(x => {
            let Config = Object.assign({}, x);
            if (
              Config.streamerDisplayName &&
              Config.authKey &&
              !Config.streamer
            ) {
              getBlockchainUsername(Config.streamerDisplayName).then(
                username => {
                  if (username.length === 0) return;
                  Config.streamer = username;
                  rxConfig.next(Config);
                }
              );
              return false;
            }
            return !!x.streamer;
          }),
          first()
        )
        .subscribe(config => {
          ws.send(
            JSON.stringify({
              type: 'connection_init',
              payload: {}
            })
          );
          ws.send(
            JSON.stringify({
              id: '1',
              type: 'start',
              payload: {
                variables: {
                  streamer: config.streamer
                },
                extensions: {},
                operationName: 'StreamMessageSubscription',
                query:
                  'subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n'
              }
            })
          );
        });
    });
    return ws;
  },
  protocols: ['graphql-ws']
});

const messages$ = socket$.pipe(
  // the observable produces a value once the websocket has been opened
  switchMap(getResponses => {
    return getResponses(input$);
  }),
  retryWhen(errors => errors.pipe(delay(1000)))
);

module.exports = { messages$, input$ };

// const messagesSubscription = messages$.subscribe(
//   (message) => {
//     console.log('received message:', message);
//     // respond to server
//     input$.next('i got your message')
//   },
//   (error) => {
//     const { message } = error
//     if (message === normalClosureMessage) {
//       console.log('server closed the websocket connection normally')
//     } else {
//       console.log('socket was disconnected due to error:', message)
//     }
//   },
//   () => {
//     // The clean termination only happens in response to the last
//     // subscription to the observable being unsubscribed, any
//     // other closure is considered an error.
//     console.log('the connection was closed in response to the user')
//   },
// )
