import { rxConfig } from './rxConfig';
import {
  distinctUntilChanged,
  filter,
  map,
  flatMap,
  tap
} from 'rxjs/operators';
import { IConfig, IMe } from '..';
import { from, empty, BehaviorSubject } from 'rxjs';
import { getSelf } from './dlive/getSelf';

/**
 * @description rxMe is the equivlenet of calling getSelf to dlive but instead of using api calls it will call only when the streamerAuthKey in rxConfig updates
 */
export const rxMe = new BehaviorSubject<IMe>({
  username: '',
  displayname: '',
  livestream: {
    createdAt: '0'
  }
});

rxConfig
  .pipe(
    filter(x => !!x),
    distinctUntilChanged((x, y) => {
      return (
        { streamerAuthKey: null, ...x }.streamerAuthKey ===
        { streamerAuthKey: null, ...y }.streamerAuthKey
      );
    }),
    map((config: Partial<IConfig>) => {
      if (!config.streamerAuthKey) {
        return empty();
      }

      return from(getSelf(config.streamerAuthKey));
    }),
    flatMap(e => e)
  )
  .subscribe(me => {
    rxMe.next(me);
  });
