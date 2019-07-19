import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { firebaseEmotes$, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

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
    let listener = firebaseEmotes$.subscribe((data: any) => {
      setEmotes(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = id => {
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
    if (
      stickerDLiveId.substring(0, 7) == ':emote/' &&
      stickerDLiveId.substring(stickerDLiveId.length - 1) == ':'
    ) {
      return true;
    } else {
      return false;
    }
  };

  const cleanId = () => {
    if (stickerDLiveId.indexOf(':') > 0) {
      return stickerDLiveId.replace(
        stickerDLiveId.substring(0, stickerDLiveId.indexOf(':')),
        ''
      );
    } else {
      return stickerDLiveId;
    }
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Add Sticker</h2>
      <div style={stateTheme.popup.dialog.content.fullWidth}>
        <div>
          <div style={stateTheme.popup.dialog.content.addSticker.imageContainer}>
            <img  style={stateTheme.popup.dialog.content.addSticker.imageContainer.image} src={`${stickerUrl}`} />
          </div>
          <div style={stateTheme.popup.dialog.content.addSticker.idContainer}>
            <span style={stateTheme.popup.dialog.content.addSticker.idContainer.title}>Sticker DLive Id:</span>
            <span style={stateTheme.popup.dialog.content.addSticker.idContainer.info}>{cleanId()}</span>
          </div>
        </div>
        <div style={stateTheme.popup.dialog.buttonStack}>
          <Button
            title={'Send Sticker'}
            isSubmit={true}
            stateTheme={stateTheme}
            buttonStyle={{ width: '-webkit-fill-available' }}
            onClick={() => {
              sendMessage();
            }}
          />
          <Button
            title={'Add Sticker'}
            isSubmit={true}
            stateTheme={stateTheme}
            buttonStyle={{
              width: '-webkit-fill-available',
              'margin-left': '10px'
            }}
            onClick={() => {
              save();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { AddStickerPopup };
