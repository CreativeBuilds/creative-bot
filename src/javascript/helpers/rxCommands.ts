import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxCommands = new BehaviorSubject({});

ipcRenderer.send('getRxCommands');
ipcRenderer.on('rxCommands', (event, commands) => {
  rxCommands.next(commands);
});

const setRxCommands = commands => {
  ipcRenderer.send('setRxCommands', commands);
};

export { rxCommands, setRxCommands };
