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

ipcRenderer.on('rxConfig', (event, config) => {
  if (!config.authKey) {
    config.authKey = null;
  }
  console.log(config.authKey);
  console.log('GOT CONFIG', Object.keys(config));
  setRxConfig(config);
});

export const firebaseConfig$ = new BehaviorSubject({ first: true });

ipcRenderer.on('rxConfigFirst', (throwaway, originalConfig) => {
  firebaseConfig$.pipe(first()).subscribe(config => {
    let newConfig = Object.assign({}, config, originalConfig);
    setRxConfig(newConfig);
  });
});

rxFirebaseuser
  .pipe(
    filter(x => !!x),
    mergeMap((user: any) => {
      if (isEmpty(user))
        return new BehaviorSubject({ init: true }).pipe(first());
      ipcRenderer.send('getRxConfig');
      return docData(firestore.collection('configs').doc(user.uid)).pipe(
        map((x: any) => {
          return Object.assign(
            {},
            x,
            {
              loadedFirebaseConfig: true,
              init: true,
              isFirebaseUser: user.uid,
              acceptedToS: true
            },
            typeof x.theme === 'undefined' ? { theme: 'dark' } : {}
          );
        })
      );
    })
  )
  .subscribe((config: any) => {
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
      // Set default points to 5, and if it's a string, set it to be a number
      if (!config.points || isNaN(Number(config.points))) config.points = 5;
      // Defaults to 5 minutes
      if (!config.pointsTimer || isNaN(Number(config.pointsTimer)))
        config.pointsTimer = 300;
      // Defaults to Dark Theme 'dark'
      if (!config.themeType) config.themeType = 'dark';
      // Defaults to true
      if (
        !config.enableEvents &&
        typeof config.enableStickersAsText !== 'boolean'
      )
        config.enableEvents = true;
      // Defaults to true
      if (
        !config.enableStickers &&
        typeof config.enableStickersAsText !== 'boolean'
      )
        config.enableStickers = true;
      // Defaults to true
      if (
        !config.enableStickersAsText &&
        typeof config.enableStickersAsText !== 'boolean'
      )
        config.enableStickersAsText = false;
      // Defaults to true
      if (
        !config.enableTimestamps &&
        typeof config.enableStickersAsText !== 'boolean'
      )
        config.enableTimestamps = true;
      // Defaults to true
      if (
        !config.enableTimestampsAsDigital &&
        typeof config.enableStickersAsText !== 'boolean'
      )
        config.enableTimestampsAsDigital = true;
      if (!config.commandPrefix) config.commandPrefix = '!';
      if (isEmpty(rxUser)) {
        firebaseConfig$.next(config);
        return ipcRenderer.send('setRxConfig', config);
      }
      firestore
        .collection('configs')
        .doc(rxUser.uid)
        .set(config);
    });
};
