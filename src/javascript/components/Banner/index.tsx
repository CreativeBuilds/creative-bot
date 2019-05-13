import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

import { BannerItem } from './BannerItems';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Banner.scss');

interface BannerActionInfo {
    title: String,
    action: () => void
}

interface BannerMessage {
    needsBanner: Boolean,
    message: String,
    alertType: String,
    hasAction: Boolean,
    actionInfo?: BannerActionInfo
}

interface Banner {
    isOpen?: Boolean,
    alertType?: String
}

const Banner = ( {isOpen, alertType } : Banner) => {
    
    var [opened, setIsOpen] = useState<Boolean>(isOpen);
    const [alert, setAlert] = useState(alertType);
    const [message, setMessage] = useState('');
    var [hasAction, setHasAction] = useState<Boolean>(false);
    const [bannerActionMessage, setBannerActionMessage] = useState<BannerActionInfo>(null);
    //var Opened = props.isOpen;

    const setAlertType = (type : String) => {
        switch(type) {
            case 'normal':
                return styles.banner + " " + styles.normal;
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

    ipcRenderer.on('show-bannermessage', function(event, args) {
        var bannerMessage = args[0] as BannerMessage
        if (bannerMessage.needsBanner == true) {
            setIsOpen(true);
            setMessage(bannerMessage.message as string);
            setBannerActionMessage(bannerMessage.actionInfo);
            setAlert(bannerMessage.alertType)
            setAlertType(alert);
            setHasAction(bannerMessage.hasAction)
        }
    });

    ipcRenderer.on('hide-bannermessage', function(event) {
        setIsOpen(false)
    });

    return (
        <div className={`${setAlertType(alert)} ${opened ? styles.opened : styles.closed}`} >
            <div className={`${styles.bannerItem} ${styles.content}`}>
                <BannerItem message={message} hasAction={hasAction} actionInfo={bannerActionMessage} />
            </div>
            <MdClose className={`${styles.bannerItem} ${styles.closeBtn}`}  onClick={() => {
                setIsOpen(false);
            }} />
        </div>);
};

export { Banner, BannerMessage, BannerActionInfo };