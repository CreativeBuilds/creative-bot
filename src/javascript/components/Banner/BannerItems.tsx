import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

import { BannerActionInfo } from './index';

interface BannerItem {
    message: String,
    hasAction: Boolean,
    actionInfo?: BannerActionInfo
}

const BannerItem = ( { message, hasAction = false, actionInfo  } : BannerItem) => {

    return (
        <div className={null} >
            {hasAction ? <span>{`${message}: `} <a onClick={() => actionInfo.action()} href="#">{actionInfo.title}</a></span> :
            <span>{message}</span>
            }
        </div>);
}

export {BannerItem}