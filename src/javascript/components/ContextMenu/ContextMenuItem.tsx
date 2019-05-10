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

    const isSeperator = () => {
        if (contextItem.role == "seperator") {
            return true;
        } else {
            return false;
        }
    }

    return (
        <li className={`${styles.contextMenuItem} ${isEnabled()}`} onClick={() => contextItem.action()  }>
             {isSeperator() ? <div><hr className={styles.seperatorLine}/></div>: 
             <div> 
                 <div className={styles.title}>{contextItem.title}</div>
                <div className={styles.shortcut}>{contextItem.shortcut}</div>
             </div>
             }
        </li>
    );
}

export { ContextMenuItem }