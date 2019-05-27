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
    stickerUrl: String,
    stickerId: String,
    styles: any;
    stateTheme: any;
    text?: string | Function | Element | any;
    Config?: any;
    closeCurrentPopup: Function | any;
}

const AddStickerPopup = ({
    stickerId,
    stickerUrl,
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

    const setError = error => {
        SetError(true);
        SetHelperText(error);
        setTimeout(() => {
          SetError(false);
          SetHelperText(text);
        }, 5000);
      };
    
      const isError = () => {
        if (text !== helperText && !error) {
          SetHelperText(text);
          setName('');
        }
        return error;
      };
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <div className={`${styles.stickersPopup}`}>
            <h2>Add Sticker</h2>
            <div>
                <div className={styles.sticker_container}>
                    <img className={`${styles.previewSticker}`} src={`${stickerUrl}`} />
                </div>
                <div className={styles.stickerIdContainer}>
                    <span className={styles.idTitle}>Sticker Id:</span>
                    <span className={styles.idInfo}>{stickerId}</span>
                </div>
            </div>
        </div>
        <div
        className={styles.submit}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
        }}
        onClick={() => { closeCurrentPopup(name, setError); }}>
        Add Sticker
        </div>
      </div>
    );
  };

  export { AddStickerPopup }