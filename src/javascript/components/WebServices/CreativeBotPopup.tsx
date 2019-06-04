import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { rxEmotes, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./WebServices.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
    styles: any;
    stateTheme: any;
    text?: string | Function | Element | any;
    Config?: any;
    closeCurrentPopup: Function | any;
    Emotes?: {};
}

const CreativeBotPopup = ({
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
    

    return (
      <div className={`${styles.popup}`} style={theme.dark}>
        <h2>Welcome to CreativeBot</h2>
        <div  className={`${styles.creativeBotPopup}`}>
            This is a Test Popup for when CreativeBot Online becomes avaliable to everyone, and this one of the ways for the app to promote the service
        </div>
        <div className={styles.buttonstack}>
          <div
          className={styles.submit}
          style={{
            backgroundColor: stateTheme.menu.backgroundColor,
            color: stateTheme.menu.color,
            borderColor: stateTheme.menu.backgroundColor
          }}
          onClick={() => { 
              
            }}>
          Continue Offline Mode
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
          Learn More
          </div>
        </div>
      </div>
    );
  };

  export { CreativeBotPopup }