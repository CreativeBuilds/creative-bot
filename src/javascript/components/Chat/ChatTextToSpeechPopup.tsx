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
import { Slider } from '../Generics/Slider';
import { Panel } from '../Generics/Panel';

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

const ChatTextToSpeechPopup = ({
    styles,
    stateTheme,
    text = '',
    Config = {},
    closeCurrentPopup
  }: popup) => {
    const [name, setName] = useState<string>('');
    const [hasFilteredEvents, setHasFilteredEvents] = useState(Config.enableEvents);
    const [error, SetError] = useState(false);
    const [config, setConfig] = useState(Config);

    useEffect(() => {
      let listener = rxConfig.subscribe((data: any) => {
        delete data.first;
        setConfig(data);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);
    
    const saveToDB = (id) => {
      /*let tConfig = Object.assign({}, config);

      if (id === 'enableEvents') {
        tConfig[id] = !hasFilteredEvents;
        setHasFilteredEvents(!hasFilteredEvents);
      } else if (id === 'enableStickers') {
        tConfig[id] = !hasFilteredStickers;
        setHasFilteredStickers(!hasFilteredStickers);
      } else if (id === 'enableStickersAsText') {
        tConfig[id] = !hasStickersAsText;
        setHasStickersAsText(!hasStickersAsText);
      } else if (id === 'enableTimestamps') {
        tConfig[id] = !hasFilteredTimestamps;
        setHasFilteredTimestamps(!hasFilteredTimestamps);
      } else if (id === 'enableTimestampsAsDigital') {
        tConfig[id] = !hasTimestampsAsDigital
        setHasTimestampsAsDigital(!hasTimestampsAsDigital);
      }
      setRxConfig(tConfig);*/
    };


    return (
      <div className={`${styles.popup}`}>
        <h2>Chat Filters</h2>
        <div className={`${styles.chatFilterPopup}`}>
          <Toggle header="Enable Text To Speech (TTS)" type={ToggleType.stretched} isEnabled={true} isOn={hasFilteredEvents} onClick={() => { saveToDB('enableEvents'); }} stateTheme={stateTheme}/>
          <Slider header="Amplitude" val={100} maxValue={200} hasHeader={true} onChange={(e, value) => {}} style={styles}/>
          <Slider header="Pitch" val={50} maxValue={100} hasHeader={true} onChange={(e, value) => {}} style={styles}/>
          <Slider header="Speed" val={175} maxValue={300} hasHeader={true} onChange={(e, value) => {}} style={styles}/>
          <Slider header="Word Gap" val={0} valType={"ms"} maxValue={100} hasHeader={true} onChange={(e, value) => {}} style={styles}/>
        </div>
        <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
            closeCurrentPopup();
            }}>
          Close
          </div>
      </div>
    );
  };

  export { ChatTextToSpeechPopup }