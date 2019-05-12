import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';
import { ContextMenuItem } from './ContextMenuItem';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./ContextMenu.scss');

interface ContextItem {
    role: String,
    icon?: Object,
    title?: String,
    shortcut?: String,
    action?: () => void,
    enabled: Boolean,
    contextMenu?: Array<ContextItem>,
}

interface ContextMenu {
    isOpen?: Boolean,
    isSubMenu?: Boolean,
    onClickedOutside?: () => void,
    contextItems: Array<ContextItem>
}

const ContextMenu = ({contextItems, isOpen = false, onClickedOutside, isSubMenu = false} : ContextMenu) => {

    const [stateTheme, setStateTheme] = useState(theme.dark);
    const [opened, setOpened] = useState<Boolean>(isOpen);

    const loadContextMenuItems = () => {
        var contextMenuItemsObjs = []

        for (var i = 0; i < contextItems.length; i++) {
            contextMenuItemsObjs.push(<ContextMenuItem contextItem={contextItems[i]} />);
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