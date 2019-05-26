import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

import { MenuBarItem } from './MenuBarItem';
import { ContextItem } from './../ContextMenu/index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');

interface MenuItem {
  title: String;
  contextMenu?: Array<ContextItem>;
  action?: any;
  enabled?: Boolean;
}

interface MenuBar {
  hidden?: Boolean;
  menuItems?: Array<MenuItem>;
}

const MenuBar = ({ menuItems, hidden = true }: MenuBar) => {
  return (
    <ul className={styles.menuBar}>
      {menuItems.map(i => (
        <MenuBarItem menuItem={i} />
      ))}
    </ul>
  );
};

export { MenuBar, MenuItem };
