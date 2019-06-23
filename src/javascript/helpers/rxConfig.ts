import { first, filter, switchMap, mergeMap, map, tap } from 'rxjs/operators';
// import {
//   firebaseConfigs$
// } from './firebase';
import { isEmpty, differenceWith, isEqual } from 'lodash';
import { rxFirebaseuser, firestore } from './firebase';
import { collectionData, docData } from 'rxfire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

// const rxConfigs = new BehaviorSubject({});

ipcRenderer.on('rxConfig', (event, config) => {
  console.log('got config back from ipcRenderer', config);
  setRxConfig(config);
});

export const firebaseConfig$ = new BehaviorSubject({ first: true });

rxFirebaseuser
  .pipe(
    filter(x => !!x),
    mergeMap((user: any) => {
      if (isEmpty(user))
        return new BehaviorSubject({ init: true }).pipe(first());
      console.log('TRYING TO GET CONFIG FROM FIRESTORE');
      return docData(firestore.collection('configs').doc(user.uid));
    })
  )
  .subscribe((config: any) => {
    console.log('inside subscribe', config);
    firebaseConfig$.next(config);
  });

firebaseConfig$.subscribe(config => {
  if (config.first === true) return;
  ipcRenderer.send('setRxConfig', config);
});

export const setRxConfig = config => {
  rxFirebaseuser
    .pipe(
      tap(x => console.log('current user progress', x)),
      filter(x => !!x),
      tap(x => console.log('USER HAS PASSED FILTER TEST', x)),
      first()
    )
    .subscribe((rxUser: any) => {
      if (isEmpty(rxUser)) {
        console.log('rxUser is empty');
        firebaseConfig$.next(config);
        return ipcRenderer.send('setRxConfig', config);
      } else {
        console.log('GOT RX USER', rxUser);
      }
      console.log('setting config');
      firestore
        .collection('configs')
        .doc(rxUser.uid)
        .set(config);
    });
};
