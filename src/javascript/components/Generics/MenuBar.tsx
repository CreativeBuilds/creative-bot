import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, useComponentVisible } from '../../helpers';

import { ContextMenu, ContextItem } from './../ContextMenu/index';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

interface MenuItem {
  title: String;
  contextMenu?: Array<ContextItem>;
  action?: any;
  enabled?: Boolean;
}

interface MenuBar {
  hidden?: Boolean;
  stateTheme: any;
  menuItems?: Array<MenuItem>;
}

interface MenuBarItem {
    hidden?: Boolean;
    stateTheme: any;
    action?: any;
    menuItem: MenuItem;
}

const MenuBar = ({ menuItems, stateTheme, hidden = true }: MenuBar) => {
  return (
    <ul style={stateTheme.menuBar}>
      {menuItems.map(i => (
        <MenuBarItem menuItem={i} stateTheme={stateTheme} />
      ))}
    </ul>
  );
};

const MenuBarItem = ({ menuItem, stateTheme, hidden = true, action }: MenuBarItem) => {
    const [show, showMenu] = useState<Boolean>(false);
    const [isHovering, setHovering] = useState<Boolean>(false);
    const [config, setConfig] = useState<any>(null);
  
    const {
      ref,
      isComponentVisible,
      setIsComponentVisible
    } = useComponentVisible(show);
  
    const showContextMenu = () => {
      if (show) {
        showMenu(false);
      } else {
        showMenu(true);
      }
    };
  
    return (
      <li
        ref={ref}
        style={
            Object.assign({},
          isComponentVisible
            ? isHovering
              ? stateTheme.base.quaternaryBackground
              : stateTheme.base.quaternaryBackground
            : isHovering
            ? stateTheme.menuBar.item.hover
            : null,
            stateTheme.menuBar.item
            )
        }
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          style={stateTheme.menuBar.item.container}
          onClick={() => setIsComponentVisible(true)}
        >
          <div style={stateTheme.menuBar.item.title}>{menuItem.title}</div>
        </div>
        {isComponentVisible && (
          <ContextMenu
            contextItems={menuItem.contextMenu}
            onClickedOutside={() => setIsComponentVisible(false)}
          />
        )}
      </li>
    );
};

export { MenuBar, MenuItem };
