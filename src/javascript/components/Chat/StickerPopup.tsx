import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { rxEmotes, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Emote } from './Emote';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Chat.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
  styles: any;
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  Emotes?: {}
}

const StickerPopup = ({
    styles,
    stateTheme,
    text = '',
    Config = {},
    Emotes = {}
  }: popup) => {
    const [name, setName] = useState<string>('');
    const [toggle, setToggle] = useState<string>('name');
    const [isDesc, setIsDesc] = useState<boolean>(true);
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

    let emoteSavedArray = _.orderBy(
      _.sortBy(Object.keys(emotes))
        .map(name => emotes[name])
    );

    const segmentControlItems = () => {
      console.log(emoteSavedArray);
        var items : Array<SegmentControlSource> = [
            {
                id: 0,
                name: "All",
                page: <div className={styles.gridView}>
                  {emoteSavedArray.map(i => <Emote stickerDLiveId={i.dliveid} stickerUrl={i.url}/>)}
                </div>
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
                page: <div className={styles.gridView}>
                  {emoteSavedArray.map(i => <Emote stickerDLiveId={i.dliveid} stickerUrl={i.url}/>)}
                </div>
            },
        ]

        return items;
    }
  
    return (
      <div className={styles.popup} style={stateTheme.main}>
        <h2>Stickers</h2>
        <div className={`${styles.stickersPopup}`}>
            <SegmentControl source={segmentControlItems()} defaultValue="All"/>
        </div>
      </div>
    );
  };

  export { StickerPopup }