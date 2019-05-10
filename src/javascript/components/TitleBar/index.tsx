import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';
import { MdClose, MdCheckBoxOutlineBlank, MdFlipToFront, Md3DRotation, MdRemove  } from 'react-icons/md';

import { MenuBar, MenuItem } from '../MenuBar';
import {ContextMenu, ContextItem} from '../ContextMenu';
import { ContextMenuItem } from '../ContextMenu/ContextMenuItem';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./TitleBar.scss');

const menuItems : Array<MenuItem> = [
    {
        title: "File",
        contextMenu: [
            {
                role: 'normal',
                title: 'Exit',
                shortcut: 'Ctrl+Esc',
                enabled: true
            }
        ] as unknown as Array<ContextItem>
    },
    {
        title: 'Edit',
        contextMenu: [
            {
                role: 'normal',
                title: 'Undo',
                shortcut: 'Ctrl+Z',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Redo',
                shortcut: 'Ctrl+Y',
                enabled: true
            },
            {
                role: 'seperator'
            },
            {
                role: 'normal',
                title: 'Cut',
                shortcut: 'Ctrl+X',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Copy',
                shortcut: 'Ctrl+C',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Paste',
                shortcut: 'Ctrl+V',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Paste & Match Style',
                shortcut: 'Ctrl+Shift+V',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Delete',
                shortcut: '',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Select All',
                shortcut: 'Ctrl+A',
                enabled: true
            }
        ] as unknown as Array<ContextItem>
    },
    {
        title: 'View',
        contextMenu: [
            {
                role: 'normal',
                title: 'Reload',
                shortcut: 'Ctrl+R',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Force Reload',
                shortcut: 'Ctrl+Shift+R',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Toggle Developer Tools',
                shortcut: 'Ctrl+Shift+I',
                enabled: true,
                action:  function() { 
                    console.log('This Menu Context Item action is working!');
                    remote.getCurrentWindow().webContents.toggleDevTools()
                }
            },
            {
                role: 'seperator',
            },
            {
                role: 'normal',
                title: 'Actual Size',
                shortcut: 'Ctrl+0',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Zoom In',
                shortcut: 'Ctrl+Shift+=',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Zoom Out',
                shortcut: 'Ctrl+Shift+-',
                enabled: true
            },
            {
                role: 'seperator'
            },
            {
                role: 'normal',
                title: 'Toggle Full Screen',
                shortcut: 'F11',
                enabled: true
            },
        ] as Array<ContextItem>
    },
    {
        title: 'Window',
        contextMenu: [
            {
                role: 'normal',
                title: 'Minimize',
                shortcut: 'Ctrl+M',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Close',
                shortcut: 'Ctrl+W',
                enabled: true
            },
        ] as unknown as Array<ContextItem>
    },
    {
        title: 'Help',
        contextMenu: [
            {
                role: 'normal',
                title: 'Learn More',
                shortcut: '',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Documentation',
                shortcut: '',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Community Discussions',
                shortcut: '',
                enabled: true
            },
            {
                role: 'normal',
                title: 'Github Page',
                shortcut: '',
                enabled: true
            },
            {
                role: 'normal',
                title: 'About App',
                shortcut: '',
                enabled: true
            },
        ] as unknown as Array<ContextItem>
    }
];

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
                <div className={`${styles.actionBtn} ${styles.devTools}`} onClick={() => { showDevTools(); }}>
                    Dev Tools
                </div>
            </div>
            <div className={styles.windowControlsContainer}>
                <div className={`${styles.actionBtn}`} onClick={() => { minimize(); }}>
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