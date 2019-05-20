import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, MenuItems } from '../../helpers';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { MdClose, MdCheckBoxOutlineBlank, MdFlipToFront, MdRemove, MdBrightnessLow, MdBrightness3  } from 'react-icons/md';

import { MenuBar, MenuItem } from '../MenuBar';
import { WindowsActionButton } from './WindowsActionButton';
import {ContextMenu, ContextItem} from '../ContextMenu';
import { ContextMenuItem } from '../ContextMenu/ContextMenuItem';
import { webContents } from 'electron';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');
const { app } = remote;

const styles: any = require('./TitleBar.scss');

interface TitleBar {
    Config?: {}
}

const TitleBar = ({ Config = null } : TitleBar) => {

    const [stateTheme, setStateTheme] = useState(ThemeContext);
    const [themeType, setThemeType] = useState<String>('dark');
    const [isDarkMode, setDarkMode] = useState<Boolean>(true);
    const [menuItems, setMenuItems] = useState<Array<MenuItem>>(MenuItems('dark'));
    const [isHovering, setHovering] = useState<Boolean>(false);
    const [config, setConfig] = useState<any>(Config);

    const changeTheme = (themeVal : String) => {
        if (themeVal == 'dark') {
          setStateTheme(theme.dark); 
          setThemeType(themeVal);
        } else if (themeVal == 'light') {
          setStateTheme(theme.light);
          setThemeType(themeVal);
        }   
        setMenuItems(MenuItems(themeVal, config));
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

    const saveThemeType = () => {
        var tConfig = Object.assign({}, { themeType: themeType }, config);
        setRxConfig(tConfig);
    }

    // Toggle the Dev Tools from Electron in the current window
    const showDevTools = () => {

        remote.getCurrentWindow().webContents.toggleDevTools();
    }

    // Toggles Between Dark and Light Mode
    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
        changeTheme(isDarkMode ? 'dark' : 'light');
        saveThemeType();
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
                <WindowsActionButton Config={config} Icon={ isDarkMode ? <MdBrightnessLow /> : <MdBrightness3 /> } type={styles.appearance} onClick={() => { toggleDarkMode(); }}/>
                <WindowsActionButton Config={config} Icon={ <MdRemove /> } type={styles.appearance} onClick={() => { minimize(); }}/>
                <WindowsActionButton Config={config} Icon={getMaximizedIcon()}  type={styles.appearance} onClick={() => { maximize(); }}/>
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