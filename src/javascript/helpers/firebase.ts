import * as firebase from 'firebase';

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

const perf = firebase.performance();

export { firebase, perf };
