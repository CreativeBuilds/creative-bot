import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { rxEvents } from './rxEvents';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { IChatObject, IRXEvent } from '..';

/**
 * @description contains all new chat messages (text and emotes not events like sub/dono)
 */
export const rxChat: Observable<Partial<IChatObject>> = rxEvents.pipe(
  filter((x: IRXEvent): boolean => {
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
      return {};
    }

    // tslint:disable-next-line: no-unsafe-any
    const data: [IChatObject] = x.payload.data.streamMessageReceived;

    return data[0];
  }),
  filter(x => !!x && Object.keys(x).length !== 0)
);

/**
 * @description returns all chat messages with raw content
 */
export const rxMessages = rxChat.pipe(
  filter((chat: IChatObject): boolean => {
    if (typeof chat === 'boolean') {
      return false;
    }

    return chat.type === 'Message';
  })
);

/**
 * @description a replay subject that will give the last x amount of chat messages to whomever subscribes
 */
export const rxStoredMessages = new ReplaySubject<IChatObject>(40);

rxChat.subscribe((chat: IChatObject) => {
  rxStoredMessages.next(chat);
});
