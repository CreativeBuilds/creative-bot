const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const removeMessage = (id, streamer) => {
  ipcRenderer.send('removeMessage', { id, streamer });
};

const timeoutUser = (id, streamer) => {
  console.log('TIMING OUT USER', id, streamer);
  ipcRenderer.send('timeoutUser', { id, streamer });
};

export { removeMessage, timeoutUser };
