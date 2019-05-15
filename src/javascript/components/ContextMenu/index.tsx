import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { ContextMenuItem } from './ContextMenuItem';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./ContextMenu.scss');

interface ContextItem {
    role: String,
    icon?: Object,
    title?: String,
    shortcut?: String,
    selected?: Boolean,
    action?: () => void,
    enabled: Boolean,
    contextMenu?: Array<ContextItem>
}

interface ContextMenu {
    isOpen?: Boolean,
    isSubMenu?: Boolean,
    themeStyle?: any,
    onClickedOutside?: () => void,
    contextItems: Array<ContextItem>
}

const ContextMenu = ({contextItems, isOpen = false, onClickedOutside, isSubMenu = false, themeStyle = theme.dark} : ContextMenu) => {

    const [stateTheme, setStateTheme] = useState(themeStyle);
    const [opened, setOpened] = useState<Boolean>(isOpen);

    ipcRenderer.once('change-theme', function(event, args) { 
        var value = args[0] as string
        if (value == "dark") {
          setStateTheme(theme.dark);
        } else {
          setStateTheme(theme.light);
        }
      });

    const loadContextMenuItems = () => {
        var contextMenuItemsObjs = []

        for (var i = 0; i < contextItems.length; i++) {
            contextMenuItemsObjs.push(<ContextMenuItem contextItem={contextItems[i]} themeStyle={stateTheme} />);
        }

        return contextMenuItemsObjs;
    }

    return (
        <div className={`${styles.contextMenu} ${isSubMenu ? styles.subMenu : null }`} onClick={() => onClickedOutside() } >
            <ul className={`${styles.contextMenuContent}`}  style={stateTheme.contextMenu}>
                {loadContextMenuItems()}
            </ul>
        </div>
    );
}

export { ContextMenu, ContextItem }