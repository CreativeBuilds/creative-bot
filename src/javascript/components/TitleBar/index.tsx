import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./TitleBar.scss');

const minimizeIcon: any = require('./chrome-minimize.svg');
const maximizeIcon: any = require('./chrome-maximize.svg');
const unmaximizeIcon: any = require('./chrome-restore.svg');
const closeIcon: any = require('./chrome-close.svg');

interface TitleBar {

}

const TitleBar = () => {

    const [stateTheme, setStateTheme] = useState(theme.dark);

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
        return isMaximize ? unmaximizeIcon : maximizeIcon;
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
                <div className={styles.windowTitle}>
                    {remote.getCurrentWindow().getTitle()}
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { showDevTools(); }}>
                    Dev
                </div>
            </div>
            <div className={styles.windowControlsContainer}>
                <div className={`${styles.actionBtn}`} onClick={() => { minimize(); }}>
                    <div className={`${styles.icon} ${styles.minimize}`} >
                        <img src={minimizeIcon} style={stateTheme.titleBarActionIcon} />
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { maximize();}}>
                    <div className={`${styles.icon} ${styles.maximize}`}> 
                        <img src={getMaximizedIcon()} style={stateTheme.titleBarActionIcon}/>
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { close(); }}>
                    <div className={`${styles.icon} ${styles.close}`} >
                        <img src={closeIcon} style={stateTheme.titleBarActionIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { TitleBar }