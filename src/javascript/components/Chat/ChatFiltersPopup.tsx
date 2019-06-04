import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { rxEmotes, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';

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
    const [hasFilteredEvents, setHasFilteredEvents] = useState(Config.enableEvents);
    const [hasFilteredStickers, setHasFilteredStickers] = useState(Config.enableStickers);
    const [hasStickersAsText, setHasStickersAsText] = useState(Config.enableStickersAsText);
    const [helperText, SetHelperText] = useState(text);
    const [error, SetError] = useState(false);
    const [config, setConfig] = useState(Config);

    useEffect(() => {
      let listener = rxConfig.subscribe((data: any) => {
        delete data.first;
        setConfig(data);
        setHasFilteredEvents(data.enableEvents);
        setHasFilteredStickers(data.enableStickers);
        setHasStickersAsText(data.enableStickersAsText);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);
    
    const saveToDB = (id) => {
      let tConfig = Object.assign({}, config);

      if (id === 'enableEvents') {
        tConfig[id] = !hasFilteredEvents;
        setHasFilteredEvents(!hasFilteredEvents);
      } else if (id === 'enableStickers') {
        tConfig[id] = !hasFilteredStickers;
        setHasFilteredStickers(!hasFilteredStickers);
      } else if (id === 'enableStickersAsText') {
        tConfig[id] = !hasStickersAsText;
        setHasStickersAsText(!hasStickersAsText);
      }
      setRxConfig(tConfig);
    };


    return (
      <div className={`${styles.popup}`} style={stateTheme.main}>
        <h2>Chat Filters</h2>
        <div className={`${styles.chatFilterPopup}`}>
          <Toggle header="Show Event Messages" type={ToggleType.stretched} isEnabled={true} isOn={hasFilteredEvents} onClick={() => { saveToDB('enableEvents'); }} stateTheme={stateTheme}/>
          <Toggle header="Show Stickers" type={ToggleType.stretched} isEnabled={true} isOn={hasFilteredStickers} onClick={() => { saveToDB('enableStickers'); }} stateTheme={stateTheme}/>
          <Toggle header="Display Stickers as Text" type={ToggleType.stretched} isEnabled={hasFilteredStickers} isOn={hasStickersAsText} onClick={() => { saveToDB('enableStickersAsText'); }} stateTheme={stateTheme}/>
        </div>
        <div
          className={styles.submit}
          style={{
            backgroundColor: stateTheme.menu.backgroundColor,
            color: stateTheme.menu.color,
            borderColor: stateTheme.menu.backgroundColor
          }}
          onClick={() => { 
            closeCurrentPopup();
            }}>
          Close
          </div>
      </div>
    );
  };

  export { ChatFiltersPopup }