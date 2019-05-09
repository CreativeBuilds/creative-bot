const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const removeMessage = (id, streamer) => {
  ipcRenderer.send('removeMessage', { id, streamer });
};

export { removeMessage };
