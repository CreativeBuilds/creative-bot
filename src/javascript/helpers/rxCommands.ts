import { BehaviorSubject } from 'rxjs';
import { rxConfig } from './rxConfig';
import { first, filter, switchMap, mergeMap } from 'rxjs/operators';
import {
  setFirebaseCommands,
  rxFirebaseuser,
  firebaseCommands$
} from './firebase';
import { isEmpty } from 'lodash';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxCommands = new BehaviorSubject({});

ipcRenderer.send('getRxCommands');
ipcRenderer.on('rxCommands', (event, commands) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      return;
    } else {
      rxCommands.next(commands);
    }
  });
});

const setRxCommands = commands => {
  console.log('setting rxCommands 1');
  ipcRenderer.send('setRxCommands', commands);
};

export { rxCommands, setRxCommands };
