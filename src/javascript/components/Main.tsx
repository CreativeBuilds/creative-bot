import * as React from 'react';
import { useState } from 'react';

import { ThemeContext, theme } from '../helpers';

import { Router } from './Router';
import { Banner } from './Banner';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Main.scss');

// TODO move theme/style function to a different file

const Main = props => {
  const [stateTheme, setStateTheme] = useState(theme.dark);

  const style = (obj: {} = {}) => Object.assign(obj, stateTheme);
  // TODO swap theme based on currently selected (probably do this with context from react)
  return (
    <div className={styles.appFrame}>
      <Banner />
      <ThemeContext.Provider value={{ stateTheme, setStateTheme }}>
        <div className={styles.main} style={style().main}>
          <Router />
        </div>
      </ThemeContext.Provider>
    </div>
  );
};

export { Main };
