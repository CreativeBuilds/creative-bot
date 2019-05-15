import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, menuItems_win } from '../../helpers';
import { MdClose, MdCheckBoxOutlineBlank, MdFlipToFront, MdRemove  } from 'react-icons/md';

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

    ipcRenderer.once('change-theme', function(event, args) { 
        var value = args[0] as string
        if (value == "dark") {
          setStateTheme(theme.dark);
        } else {
          setStateTheme(theme.light);
        }
      });

    // Toggle the Dev Tools from Electron in the current window
    const showDevTools = () => {

        remote.getCurrentWindow().webContents.toggleDevTools();
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
                <MenuBar menuItems={menuItems_win} />
                <div className={styles.windowTitle}>
                    {remote.getCurrentWindow().getTitle()}
                </div>
                <div className={`${styles.versionTag}`}>
                    {app.getVersion()}
                </div>
            </div>
            <div className={styles.windowControlsContainer}>
                <div className={`${styles.actionBtn}`} onClick={() => { minimize(); }} >
                    <div className={`${styles.icon} ${styles.minimize}`} >
                        <MdRemove />
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { maximize();}}>
                    <div className={`${styles.icon} ${styles.maximize}`}> 
                        {getMaximizedIcon()} 
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { close(); }}>
                    <div className={`${styles.icon} ${styles.close}`} >
                        <MdClose />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { TitleBar }