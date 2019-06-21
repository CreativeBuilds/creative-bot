import { BehaviorSubject, from } from 'rxjs';
import { firestore, rxFirebaseuser } from '../helpers/firebase';
import { first, filter, switchMap } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { docData } from 'rxfire/firestore';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxConfig = new BehaviorSubject({});

ipcRenderer.send('getRxConfig');
ipcRenderer.on('rxConfig', (event, config) => {
  // rxConfig.next(config);
  let isFirebaseUser = config.isFirebaseUser;
  if (typeof isFirebaseUser === 'undefined') {
    return rxConfig.next(config);
  } else if (typeof isFirebaseUser === 'string' && isFirebaseUser.length > 0) {
    rxFirebaseuser.pipe(first()).subscribe((user: any) => {
      if (!isEmpty(user)) {
        // User is signed in, update the config
        delete config.loadedFirebaseConfig;
        firestore
          .collection('configs')
          .doc(user.uid)
          .set(config, { merge: true });
      }
    });
  } else {
    return rxConfig.next(config);
  }
});

rxFirebaseuser
  .pipe(filter(x => !isEmpty(x)))
  .pipe(
    switchMap((rxUser: any) => {
      return docData(firestore.collection('configs').doc(rxUser.uid));
    })
  )
  .subscribe(firestoreConfig => {
    rxConfig.next(firestoreConfig);
    ipcRenderer.send('setRxConfig', firestoreConfig);
  });
const setRxConfig = config => {
  ipcRenderer.send('setRxConfig', config);
};

export { rxConfig, setRxConfig };
