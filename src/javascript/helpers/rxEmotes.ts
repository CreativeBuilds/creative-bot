import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxEmotes = new BehaviorSubject({});

ipcRenderer.send('getRxEmotes');
ipcRenderer.on('rxEmotes', (event, emotes) => {
  rxEmotes.next(emotes);
});

const setRxEmotes = emotes => {
  ipcRenderer.send('setRxEmotes', emotes);
};

export { rxEmotes, setRxEmotes };