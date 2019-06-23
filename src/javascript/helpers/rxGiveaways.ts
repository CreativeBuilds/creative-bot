import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
// import {
//   firebaseGiveaways$
// } from './firebase';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxGiveaways = new BehaviorSubject({});
ipcRenderer.send('getRxGiveaways');
ipcRenderer.on('rxGiveaways', (event, giveaways) => {
  setRxGiveaways(giveaways);
});

export const firebaseGiveaways$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !isEmpty(x)),
    mergeMap((user: any) => {
      return collectionData(
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('giveaways')
      )
        .pipe(tap(x => console.log(`TAP Giveaways: ${x}`)))
        .pipe(
          map(arr =>
            arr.reduce((acc, giveaway: any) => {
              acc[giveaway.name] = giveaway;
              return acc;
            }, {})
          )
        );
    })
  )
  .subscribe((data: any) => firebaseGiveaways$.next(data));

firebaseGiveaways$.subscribe(giveaways => {
  if (giveaways.first) return;
  ipcRenderer.send('setRxGiveaways', giveaways);
});

export const setRxGiveaways = giveaways => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      firebaseGiveaways$
        .pipe(
          first(),
          filter(x => !!x)
        )
        .subscribe(firebaseGiveaways => {
          if (
            Object.keys(firebaseGiveaways).length === 1 &&
            firebaseGiveaways.first === true
          )
            return;
          console.log(giveaways, firebaseGiveaways, 'BOT GIVEAWAYS');
          let newGiveawaysIncoming = differenceWith(
            Object.keys(giveaways),
            Object.keys(firebaseGiveaways),
            (giveawayIDClient, giveawayIDServer) => {
              return (
                isEqual(
                  giveaways[giveawayIDClient],
                  firebaseGiveaways[giveawayIDServer]
                ) &&
                isEqual(
                  giveaways[giveawayIDClient].entries,
                  firebaseGiveaways[giveawayIDServer].entries
                ) &&
                (giveaways[giveawayIDClient].winners || []).length ===
                  (firebaseGiveaways[giveawayIDServer].winners || []).length
              );
            }
          );
          let deleteGiveawaysIncoming = differenceWith(
            Object.keys(firebaseGiveaways),
            Object.keys(giveaways),
            (var1, var2) => {
              return (
                isEqual(firebaseGiveaways[var1], giveaways[var2]) &&
                isEqual(
                  firebaseGiveaways[var1].entries,
                  giveaways[var2].entries
                ) &&
                (firebaseGiveaways[var1].winners || []).length ===
                  (giveaways[var2].winners || []).length
              );
            }
          );
          let sameArr = [];
          deleteGiveawaysIncoming = deleteGiveawaysIncoming.reduce(
            (acc, key) => {
              if (newGiveawaysIncoming.includes(key)) {
                sameArr.push(key);
              } else {
                acc.push(key);
              }
              return acc;
            },
            []
          );
          newGiveawaysIncoming = newGiveawaysIncoming.reduce((acc, key) => {
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
          deleteGiveawaysIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('giveaways')
              .doc(key);
            batch.delete(ref);
            deleted++;
            update = true;
          });
          newGiveawaysIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('giveaways')
              .doc(key);
            batch.set(ref, giveaways[key]);
            created++;
            update = true;
          });
          sameArr.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('giveaways')
              .doc(key);
            batch.update(ref, giveaways[key]);
            updated++;
            update = true;
          });
          if (update) {
            console.log(
              `Giveaways (New: ${created}) (Deleted: ${deleted}) (Updated: ${updated})`
            );
            batch.commit();
          }
        });
    });
};
