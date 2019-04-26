import { BehaviorSubject } from 'rxjs';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const rxUsers = new BehaviorSubject({});
let first = true;

ipcRenderer.send('getRxUsers');
ipcRenderer.on('rxUsers', (event, users) => {
  console.log('got users', users);
  // if (first) return (first = false);
  rxUsers.next(users);
});

const setRxUsers = users => {
  ipcRenderer.send('setRxUsers', users);
};

export { rxUsers, setRxUsers };
