import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { theme, useComponentVisible } from '../../helpers';

import { ContextMenu ,ContextItem } from './index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./ContextMenu.scss');

interface ContextMenuItem {
    contextItem: ContextItem
}

const ContextMenuItem = ({ contextItem } : ContextMenuItem) => {

    const [show, showMenu] = useState<Boolean>(false);

    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(show);

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
                            <div className={styles.title}><span>{contextItem.title}</span></div>
                            <div className={styles.shortcut}><span>{contextItem.shortcut}</span></div>
                        </div>
                    </div>;
        } else if (contextItem.role.toLowerCase() == "menu") {
            return <div className={`${styles.itemContainer}`} onMouseOver={() => setIsComponentVisible(true)}> 
                        <div className={`${styles.contextItemContent} ${styles.multimenu}`}>
                            <div className={styles.title}><span>{contextItem.title}</span></div>
                            <MdKeyboardArrowRight className={styles.arrow} />
                        </div>
                        <div>
                            {isComponentVisible && (<ContextMenu isSideMenu={true} contextItems={contextItem.contextMenu} onClickedOutside={() => setIsComponentVisible(false)}/>)}
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