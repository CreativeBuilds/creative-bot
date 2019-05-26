import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
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
}

const StickerPopup = ({
    styles,
    stateTheme,
    text = '',
    Config = {},
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

    const segmentControlItems = () => {
        var items : Array<SegmentControlSource> = [
            {
                id: 0,
                name: "All",
                page: <h4>Test 1</h4>
            },
            {
                id: 1,
                name: "Favourites",
                page: <h4>Test 2</h4>
            },
            {
                id: 2,
                name: "Channel",
                page: <h4>Test 3</h4>
            },
            {
                id: 3,
                name: "Global",
                page: <h4>Test 4</h4>
            },
            {
                id: 4,
                name: "Saved",
                page: <h4>Test 5</h4>
            },
        ]

        return items;
    }
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <div className={`${styles.stickersPopup}`}>
            <h2>Stickers</h2>
            <SegmentControl source={segmentControlItems()} defaultValue="All"/>
        </div>
      </div>
    );
  };

  export { StickerPopup }