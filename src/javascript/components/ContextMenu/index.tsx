import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, useComponentVisible } from '../../helpers';
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
    onClickedOutside?: () => void,
    contextItems: Array<ContextItem>
}

const ContextMenu = ({contextItems, isOpen = false, onClickedOutside, isSubMenu = false} : ContextMenu) => {

    const [stateTheme, setStateTheme] = useState(ThemeContext);
    const [opened, setOpened] = useState<Boolean>(isOpen);
    const [show, showMenu] = useState<Boolean>(false);
    const [config, setConfig] = useState<any>(null);

    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(false);

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

    return (
        <div className={`${styles.contextMenu} ${isSubMenu ? styles.subMenu : null }`} onClick={() => onClickedOutside() } >
            <ul className={`${styles.contextMenuContent}`}  style={stateTheme.contextMenu}>
                {contextItems.map(i => (
                    <ContextMenuItem contextItem={i} />
                ))}
            </ul>
        </div>
    );
}

export { ContextMenu, ContextItem }