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

    rxConfig.subscribe((data: any) => {
      setConfig(data);
    });

    ipcRenderer.on('change-theme', function(event, args) { 
      var value = args[0] as string
  
      if (value == 'dark') {
        setStateTheme(theme.dark);
        let tConfig = Object.assign({}, { themeType: 'dark' }, config);
        setRxConfig(tConfig);  
      } else if (value == 'light') {
        setStateTheme(theme.light);
        let tConfig = Object.assign({}, { themeType: 'light' }, config);
        setRxConfig(tConfig);
      }
    });
    
  }, []);

  return (
    <ThemeContext.Provider value={{ stateTheme, setStateTheme }}>
        <div className={styles.appFrame}>         
          <TitleBar />
          <Banner />
          <div className={styles.main} style={style().main}>
            <Router />
          </div>
        </div>
      </ThemeContext.Provider>
  );
};

export { Main };
