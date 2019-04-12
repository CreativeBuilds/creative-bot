const { app, BrowserWindow, session, ipcMain } = require('electron');
const fs = require('fs');
let config = require('./config');

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadFile(__dirname + '/dist/index.html');
}

ipcMain.on('cookies', (event, cookie) => {
  console.log("cookies fired");
  console.log(cookie);
  win.webContents.send('info',{msg: 'test'})
})

app.on('ready', createWindow);
