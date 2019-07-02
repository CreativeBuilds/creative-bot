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
import { GoNoNewline } from 'react-icons/go';
import { first } from 'rxjs/operators';

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

  const [payoutAmount, setPayoutAmount] = useState(Config.points || 5);
  const [payoutRate, setPayoutRate] = useState(
    Math.ceil((Config.pointsTimer || 300) / 60)
  );

  let payoutTimeout;
  useEffect(() => {
    if (!payoutAmount && typeof payoutAmount !== 'number') return;
    if (Number(payoutAmount) === Number(Config.points || 5)) return;
    if (payoutTimeout) clearInterval(payoutTimeout);
    payoutTimeout = setTimeout(() => {
      firebaseConfig$.pipe(first()).subscribe(config => {
        let copy: any = Object.assign({}, config);
        copy.points = Number(payoutAmount);
        setRxConfig(copy);
      });
    }, 500);
  }, [payoutAmount]);

  let payoutRateTimeout;
  useEffect(() => {
    if (!payoutRate && typeof payoutRate !== 'number') return;
    if (Number(payoutRate) === (Config.pointsTimer || 300) / 60) return;
    if (payoutRateTimeout) clearInterval(payoutRateTimeout);
    payoutRateTimeout = setTimeout(() => {
      firebaseConfig$.pipe(first()).subscribe(config => {
        let copy: any = Object.assign({}, config);
        copy.pointsTimer = Number(payoutRate) * 60;
        setRxConfig(copy);
      });
    }, 500);
  }, [payoutRate]);

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
      <h2>Chat Settings</h2>
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
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div>Points Per Minute</div>
          <input
            type={'number'}
            style={Object.assign(
              {},
              {
                flex: 1,
                border: '0px solid #000',
                borderRadius: '5px',
                padding: '5px',
                outline: 'none',
                height: '20px',
                fontSize: '16px'
              },
              stateTheme.base.tertiaryBackground
            )}
            value={payoutAmount}
            min={0}
            onChange={e => setPayoutAmount(e.target.value)}
          />
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div>
            Payout Every {payoutRate} Minute{payoutRate === 1 ? '' : 's'}
          </div>
          <input
            type={'number'}
            style={Object.assign(
              {},
              {
                flex: 1,
                border: '0px solid #000',
                borderRadius: '5px',
                padding: '5px',
                outline: 'none',
                height: '20px',
                fontSize: '16px'
              },
              stateTheme.base.tertiaryBackground
            )}
            min={1}
            value={payoutRate}
            onChange={e => setPayoutRate(Number(e.target.value))}
          />
        </div>
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
