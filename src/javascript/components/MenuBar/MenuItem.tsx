import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme } from '../../helpers';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');

interface MenuBar {
    hidden?: Boolean,
    title: String,
    action?: any
}

const MenuItem = ({title, hidden = true, action} : MenuBar) => {
     return (
         <li className={styles.menuItem}>
             <div>{title}</div>
         </li>
     );
}

export {MenuItem}