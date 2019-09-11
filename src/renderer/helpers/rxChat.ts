import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { rxEvents } from './rxEvents';
import { filter, switchMap, map } from 'rxjs/operators';
import { IChatObject, IRXEvent } from '..';

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

    return !!data
      ? data[0].type === 'Message' || data[0].type === 'Delete'
        ? true
        : false
      : false;
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
    return console.log('returning boolean', chat);
  }
  rxStoredMessages.next(chat);
});
