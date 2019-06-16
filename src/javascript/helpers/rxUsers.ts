import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxUsers = new BehaviorSubject(null);
let first = true;

ipcRenderer.send('getRxUsers');
ipcRenderer.on('rxUsers', (event, users) => {
  // if (first) return (first = false);
  rxUsers.next(users);
});

const setRxUsers = users => {
  debugger;
  ipcRenderer.send('setRxUsers', users);
};

export { rxUsers, setRxUsers };
