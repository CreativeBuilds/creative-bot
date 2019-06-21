import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { rxConfig } from './rxConfig';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxEmotes = new BehaviorSubject({});

ipcRenderer.send('getRxEmotes');
ipcRenderer.on('rxEmotes', (event, emotes) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      return;
    } else {
      rxEmotes.next(emotes);
    }
  });
});

const setRxEmotes = emotes => {
  ipcRenderer.send('setRxEmotes', emotes);
};

export { rxEmotes, setRxEmotes };
