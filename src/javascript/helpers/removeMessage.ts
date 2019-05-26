const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const removeMessage = (id, streamer) => {
  ipcRenderer.send('removeMessage', { id, streamer });
};

const timeoutUser = (id, streamer) => {
  ipcRenderer.send('timeoutUser', { id, streamer });
};

const muteUser = (id, streamer) => {
  ipcRenderer.send('muteUser', { id, streamer });
};

export { removeMessage, timeoutUser, muteUser };
