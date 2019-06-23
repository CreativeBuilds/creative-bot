import * as firebase from 'firebase';
import { BehaviorSubject, config, combineLatest, empty } from 'rxjs';
import {
  filter,
  first,
  mergeMap,
  switchMap,
  map,
  distinctUntilChanged
} from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { firebaseConfig } from './firebaseConfig';
// import { rxConfig, setRxConfig } from './rxConfig';

import { docData, collectionData } from 'rxfire/firestore';
// import { rxCommands, setRxCommands } from './rxCommands';
// import { rxTimers, setRxTimers } from './rxTimers';
// import { rxGiveaways, setRxGiveaways } from './rxGiveaways';
// import { rxUsers, setRxUsers } from './rxUsers';
// import { rxQuotes } from './rxQuotes';
// import { rxEmotes } from './rxEmotes';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

firebase.initializeApp(firebaseConfig);

export const perf = firebase.performance();

export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const rxFirebaseuser = new BehaviorSubject(null);

export const firestore = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  if (!user) return rxFirebaseuser.next({});
  rxFirebaseuser.next(user);
});

export const initLogin = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export { firebase };
Window.firebase = firebase;
