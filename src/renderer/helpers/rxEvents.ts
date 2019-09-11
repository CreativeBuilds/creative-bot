import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, first, distinctUntilChanged } from 'rxjs/operators';
import { rxConfig } from './rxConfig';
import { getSelf } from './dlive/getSelf';
import { database } from 'firebase';
import { IMe, IConfig, IRXEvent } from '..';
/**
 * @description Contains all events that happen inside of the app, if you need to react to something
 * in chat this is the thing to subscribe to
 */
export const rxEvents = new BehaviorSubject<IRXEvent>({
  payload: { data: {} },
  type: 'start'
});

const listeners: Subscription[] = [];
let ws: WebSocket;
let lastClosed: Number = 0;

/**
 * @description Start is a function that takes a webscoket location (being the ws of dlive)
 * then listens to config for changes in authKey and streamerAuthKey
 * gets the chat room of the streamerAuth and connects to it to listen to all events
 */
const start = (websocketServerLocation: string) => {
  listeners.forEach((mListener: Subscription) => {
    mListener.unsubscribe();
  });
  const listener = rxConfig
    .pipe(
      filter(x => !!x),
      filter(
        (x: Partial<IConfig>): boolean => !!x.authKey && !!x.streamerAuthKey
      ),
      distinctUntilChanged(
        (x, y) =>
          x.authKey === y.authKey && x.streamerAuthKey === y.streamerAuthKey
      )
    )
    .subscribe((config: Partial<IConfig>) => {
      if (
        (!config.authKey || config.authKey.length === 0) &&
        (!config.streamerAuthKey || config.streamerAuthKey.length === 0)
      ) {
        return setTimeout(() => {
          start(websocketServerLocation);
        }, 10000);
      }
      if (ws) {
        ws.close();
        lastClosed = Date.now();
      }
      /**
       * @description creates a websocket to dlive
       */
      ws = new WebSocket(websocketServerLocation, 'graphql-ws');

      /**
       * @description on websocket event push it to the rxEvents object
       */
      ws.onmessage = (evt: { data: string }) => {
        // tslint:disable-next-line: no-unsafe-any
        const type = JSON.parse(evt.data).type;
        if (type === 'connection_ack' || type === 'ka') {
          return;
        }
        // tslint:disable-next-line: no-unsafe-any
        rxEvents.next(JSON.parse(evt.data));
      };
      /**
       * @description connection has been established to dlive
       */
      ws.onopen = () => {
        const lastConnected = {
          first: 0
        };
        lastConnected.first = lastConnected.first + 1;
        ws.send(
          JSON.stringify({
            type: 'connection_init',
            payload: {
              authorization: config.authKey
            }
          })
        );
        if (!config.streamerAuthKey) {
          return;
        }
        /**
         * @description gets chat info about the streamer account and uses it to listen to all events
         */
        getSelf(config.streamerAuthKey)
          .then((me: IMe) => {
            /**
             * @description the actual message that is sent to dlive to start listening to chat
             */
            ws.send(
              JSON.stringify({
                id: lastConnected.first.toString(),
                type: 'start',
                payload: {
                  query: `subscription{streamMessageReceived(streamer: "${me.username}"){__typename}}`
                }
              })
            );
          })
          .catch(null);
      };
      ws.onclose = (ev: CloseEvent): any => {
        // Try to reconnect in 5 seconds
        /**
         * @description if lastClosed has fired within the last 5 seconds do not restart the websocket!
         */
        if (Math.floor(Number(lastClosed)) + 5000 > Date.now()) {
          return;
        }
        setTimeout(() => {
          start(websocketServerLocation);
        }, 5000);
      };
    });
  listeners.push(listener);
};

start('wss://api-ws.dlive.tv');
