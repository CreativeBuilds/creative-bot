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
    stickerUrl: String;
    stickerDLiveId: String;
    stickerId: String;
    styles: any;
    stateTheme: any;
    text?: string | Function | Element | any;
    Config?: any;
    closeCurrentPopup: Function | any;
    Emotes?: {};
}

const AddStickerPopup = ({
    stickerId,
    stickerDLiveId,
    stickerUrl,
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

    useEffect(() => {
      let listener = rxEmotes.subscribe((data: any) => {
        setEmotes(data);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);
    
    const saveToDB = (id) => {
      if (id.length === 0) return;
      let Emotes = Object.assign({}, emotes);
      Emotes[id] = {
        id: stickerId,
        dliveid: cleanId(),
        url: stickerUrl
      };
      setRxEmotes(Emotes);
    };

    const sendMessage = () => {
      ipcRenderer.send('sendmessage', { from: 'bot', message: stickerDLiveId });
      closeCurrentPopup();
    };

    const save = () => {
      saveToDB(stickerId);
      closeCurrentPopup();
    };

    const isVaildId = () => {
      if (stickerDLiveId.substring(0, 7) == ':emote/' && stickerDLiveId.substring(stickerDLiveId.length - 1) == ':') {
        return true;
      } else {
        return false;
      }
    }

    const cleanId = () => {
      if (stickerDLiveId.indexOf(':') > 0) {
        return stickerDLiveId.replace(stickerDLiveId.substring(0, stickerDLiveId.indexOf(':')), '')
      } else {
        return stickerDLiveId;
      }
    }

    return (
      <div className={`${styles.popup}`}>
        <h2>Add Sticker</h2>
        <div className={`${styles.stickersPopup}`}>
            <div>
                <div className={styles.sticker_container}>
                    <img className={`${styles.previewSticker}`} src={`${stickerUrl}`} />
                </div>
                <div className={styles.stickerIdContainer}>
                    <span className={styles.idTitle}>Sticker DLive Id:</span>
                    <span className={styles.idInfo}>{cleanId()}</span>
                </div>
            </div>
        </div>
        <div className={styles.buttonstack}>
          <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
              sendMessage();
            }}>
          Send Sticker
          </div>
          <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
              save();
            }}>
          Add Sticker
          </div>
        </div>
      </div>
    );
  };

  export { AddStickerPopup }