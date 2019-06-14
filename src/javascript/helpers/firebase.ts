import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { rxConfig } from './rxConfig';

const Window: any = window;

var firebaseConfig = {
  apiKey: 'AIzaSyDj5vSvQHyxvm8vQMJUlEM6I9ouQpC_r0U',
  authDomain: 'creativebuildsio.firebaseapp.com',
  databaseURL: 'https://creativebuildsio.firebaseio.com',
  projectId: 'creativebuildsio',
  storageBucket: 'creativebuildsio.appspot.com',
  messagingSenderId: '821207665817',
  appId: '1:821207665817:web:b8774a46ca7bd2db'
};
firebase.initializeApp(firebaseConfig);

export const perf = firebase.performance();

export const signUp = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const rxFirebaseuser = new BehaviorSubject({});

firebase.auth().onAuthStateChanged(user => {
  rxFirebaseuser.next(user);
  if (!user) {
    rxConfig.pipe(first()).subscribe(config => {
      if (typeof config === 'undefined') return;
      let Config: any = Object.assign({}, config);
      delete Config.refreshToken;
      delete Config.isFirebaseUser;
      rxConfig.next(Config);
    });
  }
});
export const initLogin = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export { firebase };
Window.firebase = firebase;
