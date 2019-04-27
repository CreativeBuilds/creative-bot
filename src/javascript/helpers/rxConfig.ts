import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxConfig = new BehaviorSubject({});

ipcRenderer.send('getRxConfig');
ipcRenderer.on('rxConfig', (event, config) => {
  rxConfig.next(config);
});

const setRxConfig = config => {
  ipcRenderer.send('setRxConfig', config);
};

export { rxConfig, setRxConfig };
