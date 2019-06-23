import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';
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

const ChatFiltersPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [name, setName] = useState<string>('');
  const [hasFilteredEvents, setHasFilteredEvents] = useState(
    Config.enableEvents
  );
  const [hasFilteredStickers, setHasFilteredStickers] = useState(
    Config.enableStickers
  );
  const [hasStickersAsText, setHasStickersAsText] = useState(
    Config.enableStickersAsText
  );
  const [hasFilteredTimestamps, setHasFilteredTimestamps] = useState(
    Config.enableTimestamps
  );
  const [hasTimestampsAsDigital, setHasTimestampsAsDigital] = useState(
    Config.enableTimestampsAsDigital
  );
  const [hasTTSDonations, setHasTTSDonations] = useState(
    Config.hasTTSDonations
  );
  const [helperText, SetHelperText] = useState(text);
  const [error, SetError] = useState(false);
  const [config, setConfig] = useState(Config);

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setHasFilteredEvents(data.enableEvents);
      setHasFilteredStickers(data.enableStickers);
      setHasStickersAsText(data.enableStickersAsText);
      setHasFilteredTimestamps(data.enableTimestamps);
      setHasTimestampsAsDigital(data.enableTimestampsAsDigital);
      setHasTTSDonations(data.hasTTSDonations);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = id => {
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
    } else if (id === 'enableTimestamps') {
      tConfig[id] = !hasFilteredTimestamps;
      setHasFilteredTimestamps(!hasFilteredTimestamps);
    } else if (id === 'enableTimestampsAsDigital') {
      tConfig[id] = !hasTimestampsAsDigital;
      setHasTimestampsAsDigital(!hasTimestampsAsDigital);
    } else if (id === 'hasTTSDonations') {
      tConfig[id] = !hasTTSDonations;
      setHasTTSDonations(tConfig[id]);
    }
    setRxConfig(tConfig);
  };

  return (
    <div className={`${styles.popup}`}>
      <h2>Chat Filters</h2>
      <div className={`${styles.chatFilterPopup}`}>
        <Toggle
          header='Show Event Messages'
          type={ToggleType.stretched}
          isEnabled={true}
          isOn={hasFilteredEvents}
          onClick={() => {
            saveToDB('enableEvents');
          }}
          stateTheme={stateTheme}
        />
        <Toggle
          header='Show Stickers'
          type={ToggleType.stretched}
          isEnabled={true}
          isOn={hasFilteredStickers}
          onClick={() => {
            saveToDB('enableStickers');
          }}
          stateTheme={stateTheme}
        />
        <Toggle
          header='Display Stickers as Text'
          type={ToggleType.stretched}
          isEnabled={hasFilteredStickers}
          isOn={hasStickersAsText}
          onClick={() => {
            saveToDB('enableStickersAsText');
          }}
          stateTheme={stateTheme}
        />
        <Panel
          header='Timestamp Filters'
          hasHeader={true}
          style={stateTheme.base.tertiaryBackground}
          content={
            <div>
              <Toggle
                header='Show Timestamp'
                type={ToggleType.stretched}
                isEnabled={true}
                isOn={hasFilteredTimestamps}
                onClick={() => {
                  saveToDB('enableTimestamps');
                }}
                stateTheme={stateTheme}
              />
              <Toggle
                header='Display Timestamp as Digital'
                type={ToggleType.stretched}
                isEnabled={true}
                isOn={hasTimestampsAsDigital}
                onClick={() => {
                  saveToDB('enableTimestampsAsDigital');
                }}
                stateTheme={stateTheme}
              />
            </div>
          }
        />
      </div>
      <div
        className={styles.submit}
        style={stateTheme.submitButton}
        onClick={() => {
          closeCurrentPopup();
        }}
      >
        Close
      </div>
    </div>
  );
};

export { ChatFiltersPopup };
