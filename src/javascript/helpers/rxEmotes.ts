import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
// import {
//   firebaseEmotes$
// } from './firebase';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { empty, BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxEmotes = new BehaviorSubject({});
//ipcRenderer.send('getRxEmotes');
ipcRenderer.on('rxEmotes', (event, emotes) => {
  setRxEmotes(emotes);
});

export const firebaseEmotes$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !!x),
    mergeMap((user: any) => {
      if (isEmpty(user)) return empty();
      return collectionData(
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('emotes')
      )
        .pipe(tap(x => console.log(`TAP Emotes: ${x}`)))
        .pipe(
          map(arr =>
            arr.reduce((acc, emote: any) => {
              acc[emote.name] = emote;
              return acc;
            }, {})
          )
        );
    })
  )
  .subscribe((data: any) => firebaseEmotes$.next(data));

firebaseEmotes$.subscribe(emotes => {
  if (emotes.first === true) return;
  ipcRenderer.send('setRxEmotes', emotes);
});

export const setRxEmotes = emotes => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      firebaseEmotes$
        .pipe(
          first(),
          filter(x => !isEmpty(x))
        )
        .subscribe(firebaseEmotes => {
          let newEmotesIncoming = differenceWith(
            Object.keys(emotes),
            Object.keys(firebaseEmotes),
            (var1, var2) => {
              return isEqual(emotes[var1], firebaseEmotes[var2]);
            }
          );
          let deleteEmotesIncoming = differenceWith(
            Object.keys(firebaseEmotes),
            Object.keys(emotes),
            (var1, var2) => {
              return isEqual(firebaseEmotes[var1], emotes[var2]);
            }
          );
          let sameArr = [];
          deleteEmotesIncoming = deleteEmotesIncoming.reduce((acc, key) => {
            if (newEmotesIncoming.includes(key)) {
              sameArr.push(key);
            } else {
              acc.push(key);
            }
            return acc;
          }, []);
          newEmotesIncoming = newEmotesIncoming.reduce((acc, key) => {
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
          deleteEmotesIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('emotes')
              .doc(key);
            batch.delete(ref);
            deleted++;
            update = true;
          });
          newEmotesIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('emotes')
              .doc(key);
            batch.set(ref, emotes[key]);
            created++;
            update = true;
          });
          sameArr.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('emotes')
              .doc(key);
            batch.update(ref, emotes[key]);
            updated++;
            update = true;
          });
          if (update) {
            console.log(
              `Emotes (New: ${created}) (Deleted: ${deleted}) (Updated: ${updated})`
            );
            batch.commit();
          }
        });
    });
};
