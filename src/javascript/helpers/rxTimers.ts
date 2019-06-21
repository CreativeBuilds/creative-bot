import { BehaviorSubject } from 'rxjs';
import { rxConfig } from './rxConfig';
import { first } from 'rxjs/operators';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxTimers = new BehaviorSubject({});

ipcRenderer.send('getRxTimers');
ipcRenderer.on('rxTimers', (event, timers) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      return;
    } else {
      rxTimers.next(timers);
    }
  });
});

const setRxTimers = timers => {
  ipcRenderer.send('setRxTimers', timers);
};

export { rxTimers, setRxTimers };
