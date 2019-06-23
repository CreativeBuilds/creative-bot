import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
// import {
//   firebaseQuotes$
// } from './firebase';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxQuotes = new BehaviorSubject({});

ipcRenderer.on('rxQuotes', (event, quotes) => {
  setRxQuotes(quotes);
});

export const firebaseQuotes$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !isEmpty(x)),
    mergeMap((user: any) => {
      return collectionData(
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('quotes')
      )
        .pipe(tap(x => console.log(`TAP Quotes: ${x}`)))
        .pipe(
          map(arr =>
            arr.reduce((acc, quote: any) => {
              acc[quote.quoteId] = quote;
              return acc;
            }, {})
          )
        );
    })
  )
  .subscribe((data: any) => firebaseQuotes$.next(data));

firebaseQuotes$.subscribe(quotes => {
  if (quotes.first) return;
  ipcRenderer.send('setRxQuotes', quotes);
});

export const setRxQuotes = quotes => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      firebaseQuotes$
        .pipe(
          first(),
          filter(x => !isEmpty(x))
        )
        .subscribe(firebaseQuotes => {
          let newQuotesIncoming = differenceWith(
            Object.keys(quotes),
            Object.keys(firebaseQuotes),
            (var1, var2) => {
              return isEqual(quotes[var1], firebaseQuotes[var2]);
            }
          );
          let deleteQuotesIncoming = differenceWith(
            Object.keys(firebaseQuotes),
            Object.keys(quotes),
            (var1, var2) => {
              return isEqual(firebaseQuotes[var1], quotes[var2]);
            }
          );
          let sameArr = [];
          let created = 0;
          let updated = 0;
          let deleted = 0;
          deleteQuotesIncoming = deleteQuotesIncoming.reduce((acc, key) => {
            if (newQuotesIncoming.includes(key)) {
              sameArr.push(key);
            } else {
              acc.push(key);
            }
            return acc;
          }, []);
          newQuotesIncoming = newQuotesIncoming.reduce((acc, key) => {
            if (!sameArr.includes(key)) {
              acc.push(key);
            }
            return acc;
          }, []);

          let batch = firestore.batch();
          let update = false;
          deleteQuotesIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('quotes')
              .doc(key);
            batch.delete(ref);
            update = true;
            deleted++;
          });
          newQuotesIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('quotes')
              .doc(key);
            batch.set(ref, quotes[key]);
            update = true;
            created++;
          });
          sameArr.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('quotes')
              .doc(key);
            batch.update(ref, quotes[key]);
            update = true;
            updated++;
          });
          if (update) {
            console.log(
              `Quotes (New: ${created}) (Deleted: ${deleted}) (Updated: ${updated})`
            );
            batch.commit();
          }
        });
    });
};
