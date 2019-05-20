import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { ContextMenuItem } from './ContextMenuItem';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';

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

const ContextMenu = ({contextItems, isOpen = false, onClickedOutside, isSubMenu = false, themeStyle} : ContextMenu) => {

    const [stateTheme, setStateTheme] = useState(themeStyle);
    const [opened, setOpened] = useState<Boolean>(isOpen);
    const [config, setConfig] = useState<any>(null);

    const changeTheme = (themeVal : String) => {
        if (themeVal == 'dark') {
          setStateTheme(theme.dark); 
        } else if (themeVal == 'light') {
          setStateTheme(theme.light);
        }   
    }

    useEffect(() => {
        let listener = rxConfig.subscribe((data: any) => {
          delete data.first;
          setConfig(data);
          changeTheme(data.themeType);
        });
        return () => {
          listener.unsubscribe();
        };
    }, []);

    /*ipcRenderer.once('change-theme', function(event, args) { 
        var value = args as string
        changeTheme(value);
    });*/

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