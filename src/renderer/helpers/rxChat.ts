import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { rxEvents } from './rxEvents';
import { filter, switchMap, map } from 'rxjs/operators';

/**
 * @description contains all new chat messages (text and emotes not events like sub/dono)
 */
export const rxChat: Observable<IChatObject | boolean> = rxEvents.pipe(
  filter((x: IRXEvent): boolean => {
    console.log('X', x);
    if (!x || !x.payload || !x.payload.data) {
      return false;
    }

    // tslint:disable-next-line: no-unsafe-any
    const data: [IChatObject] = x.payload.data.streamMessageReceived;

    return !!data ? (data[0].type === 'Message' ? true : false) : false;
  }),
  map((x: IRXEvent) => {
    if (!x.payload.data) {
      return false;
    }

    // tslint:disable-next-line: no-unsafe-any
    const data: [IChatObject] = x.payload.data.streamMessageReceived;

    return data[0];
  }),
  filter(x => !!x)
);

/**
 * @description a replay subject that will give the last x amount of chat messages to whomever subscribes
 */
export const rxStoredMessages = new ReplaySubject<IChatObject>(40);

rxChat.subscribe((chat: IChatObject | boolean) => {
  if (typeof chat === 'boolean') {
    return;
  }
  rxStoredMessages.next(chat);
});
