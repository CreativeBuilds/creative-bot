import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, MenuItems } from '../../helpers';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import {
  MdClose,
  MdCheckBoxOutlineBlank,
  MdFlipToFront,
  MdRemove,
  MdBrightnessLow,
  MdBrightness3
} from 'react-icons/md';

import { MenuBar, MenuItem } from '../MenuBar';
import { WindowsActionButton } from './WindowsActionButton';
import { ContextMenu, ContextItem } from '../ContextMenu';
import { ContextMenuItem } from '../ContextMenu/ContextMenuItem';
import { webContents } from 'electron';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');
const { app } = remote;

const styles: any = require('./TitleBar.scss');

interface TitleBar {
  Config?: {};
  addPopup;
  closeCurrentPopup;
}

const TitleBar = ({ Config = null, addPopup, closeCurrentPopup }: TitleBar) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [isDarkMode, setDarkMode] = useState<Boolean>(true);
  const [config, setConfig] = useState<any>(Config);
  const [menuItems, setMenuItems] = useState<Array<MenuItem>>(
    MenuItems(
      'dark',
      config,
      'windows',
      addPopup,
      styles,
      stateTheme,
      closeCurrentPopup
    )
  );

  const changeTheme = (themeVal: String) => {
    setStateTheme(themeVal == 'dark' ? theme.dark : theme.light);
  };

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setMenuItems(MenuItems(data.themeType, data));
      changeTheme(data.themeType);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveThemeType = value => {
    let tConfig = Object.assign({}, config);
    tConfig['themeType'] = value;
    setRxConfig(tConfig);
  };

  // Toggle the Dev Tools from Electron in the current window
  const showDevTools = () => {
    remote.getCurrentWindow().webContents.toggleDevTools();
  };

  // Toggles Between Dark and Light Mode
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
    changeTheme(isDarkMode ? 'dark' : 'light');
    saveThemeType(isDarkMode ? 'dark' : 'light');
  };

  // minimize the current Window
  const minimize = () => {
    remote.getCurrentWindow().minimize();
  };

  // maximize the current window
  const maximize = () => {
    if (remote.getCurrentWindow().isMaximized()) {
      remote.getCurrentWindow().unmaximize();
    } else {
      remote.getCurrentWindow().maximize();
    }

    setMaximized(isMaximized());
  };

  // check if maximized
  const isMaximized = () => {
    return remote.getCurrentWindow().isMaximized();
  };

  // get maximized icon depending if unmaximized or maximized
  const getMaximizedIcon = () => {
    return isMaximize ? (
      <MdFlipToFront />
    ) : (
      <MdCheckBoxOutlineBlank className={styles.maximized} />
    );
  };

  // Closes current window
  const close = () => {
    remote.getCurrentWindow().close();
  };

  // Declared maximized values (ables us to change the icon when maximzed or not)
  const [isMaximize, setMaximized] = useState(isMaximized());

  return (
    <div className={styles.titleBar} style={stateTheme.base.quinaryBackground}>
      <div className={styles.dragRegion} />
      <div className={styles.iconContainer}>
        <img className={styles.appIcon} src='.icon-ico/icon.ico' />
      </div>
      <div className={styles.contentContainer}>
        <MenuBar menuItems={menuItems} />
        <div className={styles.windowTitle}>
          {remote.getCurrentWindow().getTitle()}
        </div>
        <div className={`${styles.versionTag}`}>{app.getVersion()}</div>
      </div>
      <div className={styles.windowControlsContainer}>
        <WindowsActionButton
          Config={config}
          Icon={
            stateTheme == theme.dark ? <MdBrightness3 /> : <MdBrightnessLow />
          }
          type={'appearance'}
          onClick={() => {
            toggleDarkMode();
          }}
        />
        <WindowsActionButton
          Config={config}
          Icon={<MdRemove />}
          type={'minimize'}
          onClick={() => {
            minimize();
          }}
        />
        <WindowsActionButton
          Config={config}
          Icon={getMaximizedIcon()}
          type={'maximize'}
          onClick={() => {
            maximize();
          }}
        />
        <WindowsActionButton
          Config={config}
          Icon={<MdClose />}
          type={'close'}
          onClick={() => {
            close();
          }}
        />
      </div>
    </div>
  );
};

export { TitleBar };
