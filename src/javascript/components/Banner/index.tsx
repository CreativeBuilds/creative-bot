import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Banner.scss');

interface Banner {
    isOpen: Boolean,
    alertType: String
}

const Banner = ( {isOpen, alertType } : Banner) => {
    
    var [opened, setIsOpen] = useState<Boolean>(isOpen);
    const [alert] = useState(alertType);
    //var Opened = props.isOpen;

    const setAlertType = (type : String) => {
        switch(type) {
            case 'alert':
                return styles.banner + " " + styles.alert;
            case 'action':
                return styles.banner + " " + styles.action;
            case 'warning':
                return styles.banner + " " + styles.warning;
            default:
                return styles.banner + " " + styles.alert;

        }
    }

    return (
        <div className={`${setAlertType(alert)} ${opened ? styles.opened : styles.closed}`} >
            <div className={styles.bannerItem + " " + styles.content }>
                <div>Test Banner for Alerts like for Latest Update Avaliable</div>
            </div>
            <MdClose className={styles.bannerItem + " " + styles.closeBtn }  onClick={() => {
                setIsOpen(false);
            }} />
        </div>);
};

export { Banner };