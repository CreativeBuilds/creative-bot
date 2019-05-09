import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Banner.scss');

interface Banner {
    isOpen?: Boolean,
    alertType?: String
}

const Banner = ( {isOpen, alertType } : Banner) => {
    
    var [opened, setIsOpen] = useState<Boolean>(isOpen);
    const [alert] = useState(alertType);
    const [message, setMessage] = useState('');
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

    ipcRenderer.on('bannermessage', function(event, args) {
        if (args[0].needsBanner == true) {
            setIsOpen(true);
            setMessage(args[0].message);
            setAlertType(args[0].alertType);
        }
    });

    return (
        <div className={`${setAlertType(alert)} ${opened ? styles.opened : styles.closed}`} >
            <div className={`${styles.bannerItem} ${styles.content}`}>
                <div>{message}</div>
            </div>
            <MdClose className={`${styles.bannerItem} ${styles.closeBtn}`}  onClick={() => {
                setIsOpen(false);
            }} />
        </div>);
};

export { Banner };