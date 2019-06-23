import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { empty, BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxCommands = new BehaviorSubject({});
ipcRenderer.send('getRxCommands');
ipcRenderer.on('rxCommands', (event, commands) => {
  setRxCommands(commands);
});

export const firebaseCommands$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !!x),
    mergeMap((user: any) => {
      if (isEmpty(user)) return empty();
      return collectionData(
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('commands')
      )
        .pipe(tap(x => console.log(`TAP Commands: ${Object.keys(x).length}`)))
        .pipe(
          map(arr =>
            arr.reduce((acc, command: any) => {
              acc[command.name] = command;
              return acc;
            }, {})
          )
        );
    })
  )
  .subscribe((data: any) => {
    firebaseCommands$.next(data);
  });

firebaseCommands$.subscribe(commands => {
  if (commands.first === true) return;
  ipcRenderer.send('setRxCommands', commands);
});

export const setRxCommands = commands => {
  rxFirebaseuser
    .pipe(
      filter(x => !isEmpty(x)),
      first()
    )
    .subscribe((rxUser: any) => {
      firebaseCommands$
        .pipe(
          first(),
          filter(x => !(x || { first: true }).first)
        )
        .subscribe(firebaseCommands => {
          let newCommandsIncoming = differenceWith(
            Object.keys(commands),
            Object.keys(firebaseCommands),
            (var1, var2) => {
              return isEqual(commands[var1], firebaseCommands[var2]);
            }
          );
          let deleteCommandsIncoming = differenceWith(
            Object.keys(firebaseCommands),
            Object.keys(commands),
            (var1, var2) => {
              return isEqual(firebaseCommands[var1], commands[var2]);
            }
          );
          let sameArr = [];
          deleteCommandsIncoming = deleteCommandsIncoming.reduce((acc, key) => {
            if (newCommandsIncoming.includes(key)) {
              sameArr.push(key);
            } else {
              acc.push(key);
            }
            return acc;
          }, []);
          newCommandsIncoming = newCommandsIncoming.reduce((acc, key) => {
            if (!sameArr.includes(key)) {
              acc.push(key);
            }
            return acc;
          }, []);

          let batch = firestore.batch();
          let update = false;
          let deleted = 0;
          let created = 0;
          let updated = 0;
          deleteCommandsIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('commands')
              .doc(key);
            batch.delete(ref);
            update = true;
            deleted++;
          });
          newCommandsIncoming.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('commands')
              .doc(key);
            batch.set(ref, commands[key]);
            update = true;
            created++;
          });
          sameArr.forEach(key => {
            let ref = firestore
              .collection('users')
              .doc(rxUser.uid)
              .collection('commands')
              .doc(key);
            batch.update(ref, commands[key]);
            update = true;
            updated++;
          });
          if (update) {
            console.log(
              `Commands (New: ${created}) (Deleted: ${deleted}) (Updated: ${updated})`
            );
            batch.commit();
          }
        });
    });
};
