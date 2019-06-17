import { BehaviorSubject, from } from 'rxjs';
import { firestore, rxFirebaseuser } from '../helpers/firebase';
import { first } from 'rxjs/operators';
import { isEmpty } from 'lodash';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxConfig = new BehaviorSubject({});

ipcRenderer.send('getRxConfig');
ipcRenderer.on('rxConfig', (event, config) => {
  rxConfig.next(config);
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
});

const setRxConfig = config => {
  ipcRenderer.send('setRxConfig', config);
};

export { rxConfig, setRxConfig };
