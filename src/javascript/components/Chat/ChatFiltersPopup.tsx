import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { rxEmotes, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Chat.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
    styles: any;
    stateTheme: any;
    text?: string | Function | Element | any;
    Config?: any;
    closeCurrentPopup: Function | any;
}

const ChatFiltersPopup = ({
    styles,
    stateTheme,
    text = '',
    Config = {},
    closeCurrentPopup
  }: popup) => {
    const [name, setName] = useState<string>('');
    const [helperText, SetHelperText] = useState(text);
    const [error, SetError] = useState(false);
    const [config, setConfig] = useState(Config);

    useEffect(() => {
      
    }, []);
    
    const saveToDB = (id) => {
;
    };

    return (
      <div className={`${styles.popup}`} style={stateTheme.main}>
        <h2>Chat Filters</h2>
        <div className={`${styles.stickersPopup}`}>
            
        </div>
        <div
          className={styles.submit}
          style={{
            backgroundColor: stateTheme.menu.backgroundColor,
            color: stateTheme.menu.color,
            borderColor: stateTheme.menu.backgroundColor
          }}
          onClick={() => { 
            }}>
          Close
          </div>
      </div>
    );
  };

  export { ChatFiltersPopup }