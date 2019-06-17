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
  Config: {};
}

const Main = ({ Config }: Main) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [config, setConfig] = useState(Config);
  const [addPopup, setAddPopup] = useState<Function>();
  const [closeCurrentPopup, setCloseCurrentPopup] = useState<Function>();

  const style = (obj: {} = {}) => Object.assign(obj, stateTheme);
  // TODO swap theme based on currently selected (probably do this with context from react)

  const changeTheme = (themeVal: String) => {
    if (themeVal == 'dark') {
      setStateTheme(theme.dark);
    } else if (themeVal == 'light') {
      setStateTheme(theme.light);
    }
  };

  const getFuncs = (addPop, closecurrentPopup) => {
    setAddPopup(addPop);
    setCloseCurrentPopup(closecurrentPopup);
  }

  useEffect(() => {
    let listener = rxConfig.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      changeTheme(data.themeType);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ stateTheme, setStateTheme }}>
        <div className={styles.appFrame}>         
          <TitleBar Config={config} addPopup={addPopup} closeCurrentPopup={closeCurrentPopup}/>
          <Banner />
          <div className={styles.main} style={style().base.tertiaryBackground}>
            <Router getFuncs={getFuncs} />
          </div>
        </div>
    </ThemeContext.Provider>
  );
};

export { Main };
