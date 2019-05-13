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
    const [actionTitle, setActionTitle] = useState('');
    const [action, setAction] = useState<() => void>(null);
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

    ipcRenderer.on('bannermessage', function(event, args) {
        var bannerMessage = args[0] as BannerMessage
        if (bannerMessage.needsBanner == true) {
            setIsOpen(true);
            setMessage(bannerMessage.message as string);
            setAlert(bannerMessage.alertType)
            setAlertType(alert);
            setHasAction(bannerMessage.hasAction)
            setActionTitle(bannerMessage.actionInfo.title as string);
            setAction(bannerMessage.actionInfo.action);
        }
    });

    return (
        <div className={`${setAlertType(alert)} ${opened ? styles.opened : styles.closed}`} >
            <div className={`${styles.bannerItem} ${styles.content}`}>
                <BannerItem message={message} hasAction={hasAction} actionTitle={actionTitle} action={action} />
            </div>
            <MdClose className={`${styles.bannerItem} ${styles.closeBtn}`}  onClick={() => {
                setIsOpen(false);
            }} />
        </div>);
};

export { Banner };