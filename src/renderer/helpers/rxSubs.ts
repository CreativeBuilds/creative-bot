import { BehaviorSubject } from 'rxjs';
import { rxChat } from './rxChat';
import { rxEvents } from './rxEvents';
import { filter, map } from 'rxjs/operators';
import { IRXEvent, IChatObject, ISubObject } from '..';
/**
 * @description sends back the latest follow
 */
export const rxSubs = new BehaviorSubject<ISubObject | null>(null);
rxEvents
  .pipe(
    filter((x: IRXEvent): boolean => {
      if (!x || !x.payload || !x.payload.data) {
        return false;
      }

      // tslint:disable-next-line: no-unsafe-any
      const data: [IChatObject] = x.payload.data.streamMessageReceived;

      if (!data) {
        return false;
      }
      const msg = data[0];

      return !!data ? (msg.type === 'Subscription' ? true : false) : false;
    }),
    map((x: IRXEvent) => {
      if (!x.payload.data) {
        return;
      }

      // tslint:disable-next-line: no-unsafe-any
      const data: [ISubObject] = x.payload.data.streamMessageReceived;

      return data[0];
    }),
    filter(x => !!x && Object.keys(x).length !== 0)
  )
  .subscribe(sub => (!!sub ? rxSubs.next(sub) : null));
