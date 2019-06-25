import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxLists = new BehaviorSubject({});

// ipcRenderer.send('getRxLists');
ipcRenderer.on('rxLists', (event, lists) => {
  rxLists.next(lists);
});

const setRxLists = lists => {
  ipcRenderer.send('setRxLists', lists);
};

export { rxLists, setRxLists };
