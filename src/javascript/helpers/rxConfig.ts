import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxConfig = new BehaviorSubject({});
let first = true;

ipcRenderer.send('getRxConfig');
ipcRenderer.on('rxConfig', (event, config) => {
  if (first) {
    rxConfig.next(config);
    first = false;
  }
});

const setRxConfig = config => {
  ipcRenderer.send('setRxConfig', config);
};

export { rxConfig, setRxConfig };
