import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxTimers = new BehaviorSubject({});

ipcRenderer.send('getRxTimers');
ipcRenderer.on('rxTimers', (event, timers) => {
  rxTimers.next(timers);
});

const setRxTimers = timers => {
  ipcRenderer.send('setRxTimers', timers);
};

export { rxTimers, setRxTimers };
