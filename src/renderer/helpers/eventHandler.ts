import { ipcRenderer } from 'electron';
import { BehaviorSubject } from 'rxjs';

/**
 * @description this file handles all base level communication between ipcRenderer and ipcMain
 */
export const sendToMain = (name: string, object: string | object) => {
  ipcRenderer.send('event', {
    name,
    data: object
  });
};

export const rxEventsFromMain = new BehaviorSubject({
  name: 'start',
  data: {}
});

ipcRenderer.on(
  'event',
  (event: any, data: { name: string; data: { [id: string]: any } }) => {
    console.log('sending event to rx', data);
    rxEventsFromMain.next(data);
  }
);
