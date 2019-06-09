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
    Emotes?: {};
}

const ClipStreamPopup = ({
    styles,
    stateTheme,
    text = '',
    Config = {},
    Emotes = {},
    closeCurrentPopup
  }: popup) => {
    const [name, setName] = useState<string>('');
    const [helperText, SetHelperText] = useState(text);
    const [error, SetError] = useState(false);
    const [config, setConfig] = useState(Config);
    const [emotes, setEmotes] = useState(Emotes);


    return (
      <div className={styles.popup}>
        <h2>Clip Stream</h2>
        <div className={`${styles.stickersPopup}`}>
            
        </div>
        <div className={styles.buttonstack}>
          <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
              
            }}>
          Clip
          </div>
        </div>
      </div>
    );
  };

  export { ClipStreamPopup }