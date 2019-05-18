import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, menuItems_win } from '../../helpers';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { MdClose, MdCheckBoxOutlineBlank, MdFlipToFront, MdRemove, MdBrightnessLow, MdBrightness3  } from 'react-icons/md';

import { MenuBar, MenuItem } from '../MenuBar';
import {ContextMenu, ContextItem} from '../ContextMenu';
import { ContextMenuItem } from '../ContextMenu/ContextMenuItem';
import { webContents } from 'electron';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');
const { app } = remote;

const styles: any = require('./TitleBar.scss');

interface TitleBar {

}

const TitleBar = () => {

    const [stateTheme, setStateTheme] = useState(ThemeContext);
    const [isDarkMode, setDarkMode] = useState<Boolean>(true);
    const [menuItems, setMenuItems] = useState<Array<MenuItem>>(menuItems_win);
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {

        let listener = rxConfig.subscribe((data: any) => {
          delete data.first;
          setConfig(data);
          changeTheme(data.themeType);

          setDarkMode(data.themeType != 'light' ? true : false);
        });
    
        return () => {
          listener.unsubscribe();
        };
        
      }, []);

    const changeTheme = (themeVal : String) => {
        if (themeVal == 'dark') {
          setStateTheme(theme.dark); 
          //setDarkMode(true);
        } else if (themeVal == 'light') {
          setStateTheme(theme.light);
          //setDarkMode(false);
        }   
    }

    ipcRenderer.on('change-theme', function(event, args) { 
        var value = args as string
        changeTheme(String(value));
    });

    // Toggle the Dev Tools from Electron in the current window
    const showDevTools = () => {

        remote.getCurrentWindow().webContents.toggleDevTools();
    }

    // Toggles Between Dark and Light Mode
    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);

        if (isDarkMode) {
            ipcRenderer.send('changeAppTheme', ['dark']);
        } else 
        {
            ipcRenderer.send('changeAppTheme', ['light']);
        }
    }

    // minimize the current Window
    const minimize = () => {
        remote.getCurrentWindow().minimize();
    }

    // maximize the current window
    const maximize = () => {

        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }

        setMaximized(isMaximized());
    }

    // check if maximized
    const isMaximized = () => {
        return remote.getCurrentWindow().isMaximized();
    }

    // get maximized icon depending if unmaximized or maximized
    const getMaximizedIcon = () => {
        return isMaximize ? <MdFlipToFront /> : <MdCheckBoxOutlineBlank  className={styles.maximized}/>;
    }

    // Closes current window
    const close = () => {
        remote.getCurrentWindow().close();
    }

    // Declared maximized values (ables us to change the icon when maximzed or not)
    const [isMaximize, setMaximized] = useState(isMaximized());

    return (
        <div className={styles.titleBar} style={stateTheme.titleBar}>
            <div className={styles.dragRegion}>
            </div>
            <div className={styles.iconContainer} >
                <img className={styles.appIcon} src=".icon-ico/icon.ico" />
            </div>
            <div className={styles.contentContainer}>
                <MenuBar menuItems={menuItems} />
                <div className={styles.windowTitle}>
                    {remote.getCurrentWindow().getTitle()}
                </div>
                <div className={`${styles.versionTag}`}>
                    {app.getVersion()}
                </div>
            </div>
            <div className={styles.windowControlsContainer}>
                <div className={`${styles.actionBtn} ${styles.appearance}`} onClick={() => { toggleDarkMode(); }} >
                    <div className={`${styles.icon}`} >
                        { isDarkMode ? <MdBrightnessLow /> : <MdBrightness3 /> }
                    </div>
                </div>
                <div className={`${styles.actionBtn}  ${styles.minimize}`} onClick={() => { minimize(); }} >
                    <div className={`${styles.icon} ${styles.minimize}`} >
                        <MdRemove />
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { maximize();}}>
                    <div className={`${styles.icon} ${styles.maximize}`}> 
                        {getMaximizedIcon()} 
                    </div>
                </div>
                <div className={`${styles.actionBtn}  ${styles.close}`} onClick={() => { close(); }}>
                    <div className={`${styles.icon} ${styles.close}`} >
                        <MdClose />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { TitleBar }