import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxGiveaways = new BehaviorSubject({});

ipcRenderer.send('getRxGiveaways');
ipcRenderer.on('rxGiveaways', (event, giveaways) => {
  rxGiveaways.next(giveaways);
});

const setRxGiveaways = giveaways => {
  ipcRenderer.send('setRxGiveaways', giveaways);
};

export { rxGiveaways, setRxGiveaways };
