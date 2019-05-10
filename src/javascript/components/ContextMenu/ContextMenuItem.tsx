import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { ContextItem } from './index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./ContextMenu.scss');

interface ContextMenuItem {
    contextItem: ContextItem
}

const ContextMenuItem = ({ contextItem } : ContextMenuItem) => {

    const isEnabled = () => {
        if (contextItem.enabled) {
            return '';
        } else {
            return styles.inactive;
        }
    }

    return (
        <li className={`${styles.contextMenuItem} ${isEnabled()}`}>
             <div className={styles.title}>{contextItem.title}</div>
             <div className={styles.shortcut}>{contextItem.shortcut}</div>
        </li>
    );
}

export { ContextMenuItem }