import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

interface BannerItem {
    message: String,
    hasAction: Boolean,
    actionTitle: String,
    action?: () => void
}

const BannerItem = ( { message, hasAction = false, actionTitle, action } : BannerItem) => {

    return (
        <div className={null} >
            {hasAction ? <span>{`${message}: `} <a onClick={() => action()} href="#">{actionTitle}</a></span> :
            <span>{message}</span>
            }
        </div>);
}

export {BannerItem}