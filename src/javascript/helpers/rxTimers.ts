import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
// import {
//   firebaseTimers$
// } from './firebase';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxTimers = new BehaviorSubject({});

ipcRenderer.on('rxTimers', (event, timers) => {
  setRxTimers(timers);
});

export const firebaseTimers$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !isEmpty(x)),
    mergeMap((user: any) => {
      return collectionData(
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('timers')
      )
        .pipe(tap(x => console.log(`TAP Timers: ${x}`)))
        .pipe(
          map(arr =>
            arr.reduce((acc, timer: any) => {
              acc[timer.name] = timer;
              return acc;
            }, {})
          )
        );
    })
  )
  .subscribe((data: any) => firebaseTimers$.next(data));

firebaseTimers$.subscribe(timers => {
  if (timers.first) return;
  ipcRenderer.send('setRxTimers', timers);
});

export const setRxTimers = timers => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x) && !!x),
      first()
    )
    .subscribe((rxUser: any) => {
      console.log('GOT HERE');
      firebaseTimers$
        .pipe(
          first(),
          filter(x => !!x)
        )
        .subscribe(firebaseTimers => {
          let newTimersIncoming = differenceWith(
            Object.keys(timers),
            Object.keys(firebaseTimers),
            (var1, var2) => {
              return isEqual(timers[var1], firebaseTimers[var2]);
            }
          );
          let deleteTimersIncoming = differenceWith(
            Object.keys(firebaseTimers),
            Object.keys(timers),
            (var1, var2) => {
              return isEqual(firebaseTimers[var1], timers[var2]);
            }
          );
          let sameArr = [];
          deleteTimersIncoming = deleteTimersIncoming.reduce((acc, key) => {
            if (newTimersIncoming.includes(key)) {
              sameArr.push(key);
            } else {
              acc.push(key);
            }
            return acc;
          }, []);
          newTimersIncoming = newTimersIncoming.reduce((acc, key) => {
            if (!sameArr.includes(key)) {
              acc.push(key);
            }
            return acc;
          }, []);

          let batch = firestore.batch();
          let update = false;
          let created = 0;
          let deleted = 0;
          let updated = 0;
          deleteTimersIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('timers')
              .doc(key);
            batch.delete(ref);
            update = true;
            deleted++;
          });
          newTimersIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('timers')
              .doc(key);
            batch.set(ref, timers[key]);
            update = true;
            created++;
          });
          sameArr.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('timers')
              .doc(key);
            batch.update(ref, timers[key]);
            update = true;
            updated++;
          });
          if (update) {
            console.log(
              `Timers (New: ${created}) (Deleted: ${deleted}) (Updated: ${updated})`
            );
            batch.commit();
          }
        });
    });
};
