import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { MenuBarItem } from './MenuBarItem';
import { ContextItem } from './../ContextMenu/index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');

interface MenuItem {
    title: String,
    contextMenu?: Array<ContextItem>,
    action?: any,
    enabled?: Boolean
}

interface MenuBar {
    hidden?: Boolean,
    menuItems?: Array<MenuItem>
}

const MenuBar = ({menuItems, hidden = true} : MenuBar) => {

    const loadMenuItems = () => {
        var menuItemsObjs = []

        for (var i = 0; i < menuItems.length; i++) {
            menuItemsObjs.push(<MenuBarItem menuItem={menuItems[i]} />);
        }

        return menuItemsObjs;
    }

     return (
         <ul className={styles.menuBar}>
            {loadMenuItems()}
         </ul>
     );
}

export {MenuBar, MenuItem}