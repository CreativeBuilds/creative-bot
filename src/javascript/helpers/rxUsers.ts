import { BehaviorSubject } from 'rxjs';
import { rxConfig } from './rxConfig';
import { first } from 'rxjs/operators';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxUsers = new BehaviorSubject(null);

ipcRenderer.send('getRxUsers');
ipcRenderer.on('rxUsers', (event, users) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      return;
    } else {
      rxUsers.next(users);
    }
  });
});

const setRxUsers = users => {
  ipcRenderer.send('setRxUsers', users);
};

export { rxUsers, setRxUsers };
