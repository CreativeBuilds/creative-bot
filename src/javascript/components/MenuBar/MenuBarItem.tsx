import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { MenuItem } from './index';
import { ContextMenu, ContextItem } from './../ContextMenu/index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');

interface MenuBar {
    hidden?: Boolean,
    action?: any,
    menuItem: MenuItem
}

const MenuBarItem = ({menuItem, hidden = true, action} : MenuBar) => {

    const [show, showMenu] = useState<Boolean>(false);

    const showContextMenu = () => {
        if (show) {
            showMenu(false);
        } else {
            showMenu(true);
        }
    }

     return (
         <li className={styles.menuItem} onClick={() => { showContextMenu(); }} onBlur={() => { showContextMenu(); }}>
            <div className={styles.menuItemTitleContainer}>
                <div className={styles.menuItemTitle}>{menuItem.title}</div>
            </div>
            {show === true && <ContextMenu contextItems={menuItem.contextMenu} />}
         </li>
     );
}

export {MenuBarItem}