import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdKeyboardArrowRight, MdDone } from 'react-icons/md';
import { theme, useComponentVisible, ThemeContext } from '../../helpers';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';

import { ContextMenu ,ContextItem } from './index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./ContextMenu.scss');

interface ContextMenuItem {
    contextItem: ContextItem
}

const ContextMenuItem = ({ contextItem } : ContextMenuItem) => {

    const [show, showMenu] = useState<Boolean>(false);
    const [isChecked, setChecked] = useState<Boolean>(contextItem.selected);
    const [stateTheme, setStateTheme] = useState(ThemeContext);
    const [config, setConfig] = useState<any>(null);

    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(show);

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

    const isEnabled = () => {
        if (contextItem.enabled) {
            return '';
        } else {
            return styles.inactive;
        }
    }

    const isSeperator = () => {
        if (contextItem.role.toLowerCase() == "seperator") {
            return true;
        } else {
            return false;
        }
    }

    const getMenuItemType = () => {
        if (contextItem.role.toLowerCase() == "normal") {
            return <div className={`${styles.itemContainer}`}>
                        <div className={`${styles.contextItemContent} ${styles.normal}`}> 
                            <div className={styles.iconContainer}>
                                <div className={styles.icon}>

                                </div>
                                {isChecked ? <div className={styles.checkedIcon}>
                                    <MdDone />
                                </div> : null }
                            </div>
                            <div className={styles.title}><span>{contextItem.title}</span></div>
                            <div className={styles.shortcut}><span>{contextItem.shortcut}</span></div>
                        </div>
                    </div>;
        } else if (contextItem.role.toLowerCase() == "submenu") {
            return <div className={`${styles.itemContainer}`} onMouseOver={() => setIsComponentVisible(true)} onMouseLeave={() => setIsComponentVisible(false)}> 
                        <div className={`${styles.contextItemContent} ${styles.multimenu}`}>
                            <div className={styles.iconContainer}>
                                <div className={styles.icon}>

                                </div>
                            </div>
                            <div className={styles.title}><span>{contextItem.title}</span></div>
                            <MdKeyboardArrowRight className={styles.arrow} />
                        </div>
                        <div className={styles.submenuContainer}>
                            {isComponentVisible && (<ContextMenu isSubMenu={true} contextItems={contextItem.contextMenu} onClickedOutside={() => setIsComponentVisible(false)} />)}
                        </div>
                </div>;
        }
    }

    return (
        <li className={`${styles.contextMenuItem} ${isEnabled()}`} onClick={() => contextItem.action()  }>
            {isSeperator() ? <div><hr className={styles.seperatorLine}/></div>: 
                getMenuItemType()
            }
        </li>
    );
}

export { ContextMenuItem }