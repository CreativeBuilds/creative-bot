import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IEvent } from '@/renderer';

let mainWindow: Electron.BrowserWindow | null;

const rxEventHandler = new BehaviorSubject({ name: 'start', data: {} });

/**
 * @description creates the main electron window, which spawns the react project
 */
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'production' ? false : true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  let loginWindow: BrowserWindow | null | undefined = null;

  const sendToWin = (name: string, data: { [id: string]: any }) => {
    if (!mainWindow) {
      return;
    }
    mainWindow.webContents.send('event', { name, data });
  };

  ipcMain.on('event', (event: any, data: IEvent) => {
    rxEventHandler.next({ data: data.data, name: data.name });
  });

  const oauthWindowStart = (ifStreamer: boolean) => {
    if (!mainWindow) {
      return;
    }
    if (!!loginWindow) {
      try {
        loginWindow.close();
        loginWindow = null;
        loginWindow = undefined;
      } catch (err) {
        return;
      }
    }

    loginWindow = new BrowserWindow({
      parent: mainWindow,
      frame: false
    });
    loginWindow.webContents.on('did-finish-load', () => {
      if (!loginWindow) {
        return;
      }
      const injectJs = `function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }
    addStyleString('.container{ max-height: 100vh !important; overflow-y: auto !important;height:min-content;display:block;}.login-card{width: 712px !important}.author-section{display:flex; flex-wrap: wrap;}.author-section > p.author-section-item {flex:1;min-width: 200px;}');
    let but = document.getElementsByClassName('login-form-button')[0];
    let first = true;
    but.addEventListener('click', (e)=>{
      if(first) {but.setAttribute('onclick', '()=>{}');return first = false};
      e.stopPropagation();
    })`;
      loginWindow.webContents.executeJavaScript(injectJs).catch(err => null);
    });
    loginWindow.loadURL(
      `https://dlive.tv/o/authorize?client_id=2582484581&redirect_uri=https://creativebuilds.io/oauth/dlive&response_type=code&scope=identity%20chat:write%20chest:write%20comment:write%20email:read%20emote:read%20emote:write%20moderation:read%20moderation:write%20relationship:read%20relationship:write%20streamtemplate:read%20streamtemplate:write%20subscription:read%20subsetting:write%20&state=http://localhost:6942/oauth`
    );

    loginWindow.webContents.on(
      'did-fail-load',
      (mEvent, e, desc, nUrl, isMainFrame) => {
        if (!loginWindow || !mainWindow) {
          return;
        }
        if (nUrl.startsWith('http://localhost')) {
          // console.log('URL STARTS WITH THIS');
          const auth = nUrl.split('?auth=')[1];
          // console.log('GOT AUTH', url.split('?=auth='));
          if (!auth) {
            loginWindow.close();
            oauthWindowStart(ifStreamer);
          } else {
            // We got auth string boiiiiss time to set it on the
            sendToWin(ifStreamer ? 'newAuthKeyStreamer' : 'newAuthKey', {
              key: auth
            });
            loginWindow.close();
          }
        }
      }
    );

    loginWindow.webContents.on('will-navigate', (event, mUrl) => {
      if (!loginWindow || !mainWindow) {
        return;
      }
      if (mUrl.startsWith('http://localhost')) {
        // console.log('URL STARTS WITH THIS');
        const auth = mUrl.split('?auth=')[1];
        // console.log('GOT AUTH', url.split('?=auth='));
        if (!auth) {
          loginWindow.close();
          oauthWindowStart(ifStreamer);
          loginWindow = undefined;
        } else {
          // We got auth string boiiiiss time to set it on the
          mainWindow.webContents.send('newAuthKey', auth);
          loginWindow.close();
          loginWindow = undefined;
        }
      }
    });
  };

  rxEventHandler
    .pipe(filter(x => x.name === 'openLogin'))
    .subscribe((event: IEvent) => {
      oauthWindowStart(false);
    });
  rxEventHandler
    .pipe(filter(x => x.name === 'openLoginStreamer'))
    .subscribe((event: IEvent) => {
      oauthWindowStart(true);
    });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
