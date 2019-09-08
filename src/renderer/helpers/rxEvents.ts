import { BehaviorSubject } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, first } from 'rxjs/operators';
import { rxConfig } from './rxConfig';
/**
 * Contains all events that happen inside of the app
 */
export const rxEvents = new BehaviorSubject(undefined);

const start = (websocketServerLocation: string) => {
  const ws = new WebSocket(websocketServerLocation, 'graphql-ws');
  ws.onmessage = (evt: { data: string }) => {
    // tslint:disable-next-line: no-unsafe-any
    rxEvents.next(JSON.parse(evt.data));
  };
  ws.onopen = () => {
    rxConfig
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe((config: Partial<IConfig>) => {
        if (!config.authKey || config.authKey.length === 0) {
          return setTimeout(() => {
            ws.close();
            start(websocketServerLocation);
          }, 10000);
        }
        ws.send(
          JSON.stringify({
            type: 'connection_init',
            payload: {
              authorization: config.authKey
            }
          })
        );
      });
  };
  ws.onclose = () => {
    // Try to reconnect in 5 seconds
    setTimeout(() => {
      start(websocketServerLocation);
    }, 5000);
  };
};

start('wss://api-ws.dlive.tv');
