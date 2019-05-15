import * as React from 'react';
import { useState, useEffect } from 'react';

import { ThemeContext, theme } from '../helpers';
import { rxConfig, setRxConfig } from '../helpers/rxConfig';

import { Router } from './Router';
import { TitleBar } from './TitleBar';
import { Banner } from './Banner';
import { ContextMenu, ContextItem } from './ContextMenu';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Main.scss');

// TODO move theme/style function to a different 

interface Main {
  Config: {}
}

const Main = ({ Config } : Main) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [config, setConfig] = useState(Config);

  const style = (obj: {} = {}) => Object.assign(obj, stateTheme);
  // TODO swap theme based on currently selected (probably do this with context from react)

  useEffect(() => {
    let listener = rxConfig.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  ipcRenderer.on('change-theme', function(event, args) { 
    var value = args[0] as string
    if (value == 'dark') {
      setStateTheme(theme.dark);
      let Config = Object.assign({}, { themeType: 'dark' }, config);
      //setRxConfig(Config);
      ipcRenderer.send('setRxConfig', config);
      console.log(Config);  
    } else if (value == 'light') {
      setStateTheme(theme.light);
      let Config = Object.assign({}, { themeType: 'light' }, config);
      ipcRenderer.send('setRxConfig', config);
      //setRxConfig(Config);
      console.log(Config);
    }
  });

  return (
    <ThemeContext.Provider value={{ stateTheme, setStateTheme }}>
        <div className={styles.appFrame} style={style().main}>
          

          <TitleBar />
          <Banner />
          <div className={styles.main}>
            <Router />
          </div>
        </div>
      </ThemeContext.Provider>
  );
};

export { Main };
