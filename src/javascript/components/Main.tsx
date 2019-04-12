import * as React from 'react';
const Window: any = window;
const {ipcRenderer} = Window.require('electron');

const styles: any = require('./Main.scss');

ipcRenderer.send('cookies', 'test cookie!');
ipcRenderer.on('info', (event, obj) => {
  console.log(obj);
})

const theme = {
  main: {
    backgroundColor: '#333333',
    color: "#f1f1f1"
  }
}

const Main = props => {
  return <div className={styles.main} style={theme.main}>Hello Hnspn</div>;
};

export { Main };
