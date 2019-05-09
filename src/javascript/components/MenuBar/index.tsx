import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { MenuItem } from './MenuItem';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');

interface MenuItems {
    title: String,
    contextMenu?: Array<Object>,
    action?: any,
    enabled?: Boolean
}

interface MenuBar {
    hidden?: Boolean,
    menuItems?: Array<MenuItems>
}

const MenuBar = ({menuItems, hidden = true} : MenuBar) => {

    const loadMenuItems = () => {
        var menuItemsObjs = []

        for (var i = 0; i < menuItems.length; i++) {
            menuItemsObjs.push(<MenuItem title={menuItems[i].title} />);
        }

        return menuItemsObjs;
    }

     return (
         <ul className={styles.menuBar}>
            {loadMenuItems()}
         </ul>
     );
}

export {MenuBar}