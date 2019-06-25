import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
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

let timeout;

const ChatTextToSpeechPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [name, setName] = useState<string>('');
  const [hasTTSDonations, setHasTTSDonations] = useState(
    Config.hasTTSDonations
  );
  const [ttsAmplitude, setTTSAmplitude] = useState(Config.tts_Amplitude);
  const [ttsPitch, setTTSPitch] = useState(Config.tts_Pitch);
  const [ttsSpeed, setTTSSpeed] = useState(Config.tts_Speed);
  const [ttsWordGap, setTTSWordGap] = useState(Config.tts_WordGap);
  const [error, SetError] = useState(false);
  const [config, setConfig] = useState(Config);

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setHasTTSDonations(data.hasTTSDonations);
      setTTSAmplitude(data.tts_Amplitude);
      setTTSPitch(data.tts_Pitch);
      setTTSSpeed(data.tts_Speed);
      setTTSWordGap(data.tts_WordGap);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = (id, value = null) => {
    if (timeout) clearTimeout(timeout);
    let tConfig = Object.assign({}, config);

    if (id === 'hasTTSDonations') {
      tConfig[id] = !hasTTSDonations;
      setHasTTSDonations(tConfig[id]);
    } else {
      console.log('SETTING CONFIG', id, 'TO', value);
      tConfig[id] = value;
    }
    timeout = setTimeout(() => {
      console.log('THIS CONFIG IS GETTING SET', tConfig);
      setRxConfig(tConfig);
    }, 500);
  };

  return (
    <div className={`${styles.popup}`}>
      <h2>Text To Speech Settings</h2>
      <div className={`${styles.chatFilterPopup}`}>
        <Toggle
          header='Enable TTS on Donations'
          type={ToggleType.stretched}
          isEnabled={true}
          isOn={hasTTSDonations}
          onClick={() => {
            saveToDB('hasTTSDonations');
          }}
          stateTheme={stateTheme}
        />
        <Slider
          header='Amplitude'
          val={ttsAmplitude}
          maxValue={200}
          hasHeader={true}
          onValueChanged={value => {
            console.log('AMP CHANGED');
            setTTSAmplitude(value);
            saveToDB('tts_Amplitude', value);
          }}
          style={styles}
        />
        <Slider
          header='Pitch'
          val={ttsPitch}
          maxValue={200}
          hasHeader={true}
          onValueChanged={value => {
            setTTSPitch(value);
            saveToDB('tts_Pitch', value);
          }}
          style={styles}
        />
        <Slider
          header='Speed'
          val={ttsSpeed}
          maxValue={300}
          hasHeader={true}
          onValueChanged={value => {
            setTTSSpeed(value);
            saveToDB('tts_Speed', value);
          }}
          style={styles}
        />
        {/*<Slider header="Word Gap" val={ttsWordGap} valType={"ms"} maxValue={100} hasHeader={true} onChange={(e, value) => {setTTSWordGap(value); saveToDB("tts_WordGap", value);}} style={styles}/>*/}
      </div>
      <div className={styles.buttonstack}>
        <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => {
            var utter = new SpeechSynthesisUtterance();
            utter.text = 'I scream, you scream, we all scream for ice cream';
            utter.volume = config.tts_Amplitude / 100;
            utter.pitch = config.tts_Pitch / 100;
            utter.rate = config.tts_Speed / 100;
            utter.onend = () => {};
            speechSynthesis.speak(utter);
          }}
        >
          Test TTS
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
    </div>
  );
};

export { ChatTextToSpeechPopup };
