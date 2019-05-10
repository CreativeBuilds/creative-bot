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
    action?: Function,
    enabled: Boolean,
    contextMenu?: Array<ContextItem>,
}

interface ContextMenu {
    contextItems: Array<ContextItem>
}

const ContextMenu = ({contextItems} : ContextMenu) => {

    const loadContextMenuItems = () => {
        var contextMenuItemsObjs = []

        for (var i = 0; i < contextItems.length; i++) {
            contextMenuItemsObjs.push(<ContextMenuItem contextItem={contextItems[i]} />);
        }

        return contextMenuItemsObjs;
    }

    return (
        <div className={`${styles.contextMenu}`}>
            <ul className={`${styles.contextMenuContent}`}>
                {loadContextMenuItems()}
            </ul>
        </div>
    );
}

export { ContextMenu, ContextItem }