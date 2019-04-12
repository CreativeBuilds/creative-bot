import * as React from 'react';
import { Menu } from './Menu';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Main.scss');

ipcRenderer.send('cookies', 'test cookie!');
ipcRenderer.on('info', (event, obj) => {
  console.log(obj);
});

// TODO move theme/style function to a different file
const theme = {
  dark: {
    main: {
      backgroundColor: '#202225',
      color: '#f0f0f0',
      highlightColor: '#ffd300'
    }
  },
  light: {
    main: {
      backgroundColor: '#ffffff',
      color: `rgba(0,0,0,0.87)`,
      highlightColor: '#ffd300'
    }
  }
};

const style = (obj: {} = {}) => Object.assign(obj, theme['dark']);

const Main = props => {
  // TODO swap theme based on currently selected (probably do this with context from react)
  return (
    <div className={styles.main} style={style().main}>
      <Menu />
    </div>
  );
};

export { Main };
