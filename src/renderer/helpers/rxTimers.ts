import { BehaviorSubject, empty, ObservableInput } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { ITimer } from '..';
import { Timer } from './db/db';

/**
 * @description rxTimers is the behavior subject for getting the layout of all timers
 * @note this pulls directly from firebase and not local database as it doesn't update very much therefore, should not need to be hindered by using local db like users
 */
export const rxTimers = rxUser.pipe(
  filter(x => !!x),
  switchMap(
    (authUser): ObservableInput<ITimer[]> => {
      if (!authUser) {
        return empty();
      }
      const ref = firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('timers');

      return collectionData(ref);
    }
  ),
  map((timers: ITimer[]) =>
    timers.map(
      (timer): Timer =>
        new Timer(timer.name, timer.reply, timer.enabled, timer.seconds)
    )
  )
);
