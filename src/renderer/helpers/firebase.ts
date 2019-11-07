import * as firebase from 'firebase';
// import 'firebase/analytics';
import { async } from 'rxjs/internal/scheduler/async';
/**
 * @description Init login to firestore
 */
const app: firebase.app.App = firebase.initializeApp({
  apiKey: 'AIzaSyC5iSTEvNKKkm1YQQ6Ygo-CvFo89foaR0o',
  authDomain: 'creativebuildsio.firebaseapp.com',
  databaseURL: 'https://creativebuildsio.firebaseio.com',
  projectId: 'creativebuildsio',
  storageBucket: 'creativebuildsio.appspot.com',
  messagingSenderId: '821207665817',
  appId: '1:821207665817:web:b8774a46ca7bd2db'
});

const auth = firebase.auth();

/**
 *
 * @description wraps the firebase auth login
 */
const createUser = async (
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> =>
  firebase.auth().createUserWithEmailAndPassword(email, password);
const firestore = firebase.firestore();

export { firebase, app, auth, createUser, firestore };
