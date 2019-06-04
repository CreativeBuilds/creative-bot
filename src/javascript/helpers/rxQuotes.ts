import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxQuotes = new BehaviorSubject({});

ipcRenderer.send('getRxQuotes');
ipcRenderer.on('rxQuotes', (event, quotes) => {
  rxQuotes.next(quotes);
});

const setRxQuotes = quotes => {
  ipcRenderer.send('setRxQuotes', quotes);
};

export { rxQuotes, setRxQuotes };