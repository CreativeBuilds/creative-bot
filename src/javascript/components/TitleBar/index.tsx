import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./TitleBar.scss');

interface TitleBar {

}

const TitleBar = () => {
    const [stateTheme, setStateTheme] = useState(theme.dark);

    const showDevTools = () => {

        remote.getCurrentWindow().webContents.toggleDevTools();
    }

    const minimize = () => {
        remote.getCurrentWindow().minimize();
    }

    const maximize = () => {

        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }
    }

    const close = () => {
        remote.getCurrentWindow().close();
    }

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
                <div className={`${styles.actionBtn}`} onClick={() => { showDevTools(); }}>
                    <div className={`${styles.icon} ${styles.minimize}`} >
                    <svg width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg"><path d="M11 4.399V5.5H0V4.399h11z" fill={stateTheme.titleBar.color}/></svg>
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { maximize(); }}>
                    <div className={`${styles.icon} ${styles.maximize}`}> 
                        <svg width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg"><path d="M11 0v11H0V0h11zM9.899 1.101H1.1V9.9H9.9V1.1z" fill={stateTheme.titleBar.color}/></svg>
                    </div>
                </div>
                <div className={`${styles.actionBtn}`} onClick={() => { close(); }}>
                    <div className={`${styles.icon} ${styles.close}`} >
                        <svg width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z" fill={stateTheme.titleBar.color}/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { TitleBar }