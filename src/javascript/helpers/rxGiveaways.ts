import { BehaviorSubject } from 'rxjs';
import { rxConfig } from './rxConfig';
import { first } from 'rxjs/operators';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxGiveaways = new BehaviorSubject({});

ipcRenderer.send('getRxGiveaways');
ipcRenderer.on('rxGiveaways', (event, giveaways) => {
  rxConfig.pipe(first()).subscribe((config: any) => {
    let isFirebaseUser = config.isFirebaseUser;
    if (typeof isFirebaseUser === 'string') {
      /* User is using firebase dont run rxCommands.next yet */
      return;
    } else {
      rxGiveaways.next(giveaways);
    }
  });
});

const setRxGiveaways = giveaways => {
  ipcRenderer.send('setRxGiveaways', giveaways);
};

export { rxGiveaways, setRxGiveaways };
