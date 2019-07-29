import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

// Generic Components
import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';
import { RangeSlider } from '../Generics/Slider';
import { Panel } from '../Generics/Panel';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

interface popup {
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  closeCurrentPopup: Function | any;
}

let timeout;

const ChatTextToSpeechPopup = ({
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
      tConfig[id] = value;
    }
    timeout = setTimeout(() => {
      setRxConfig(tConfig);
    }, 500);
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Text To Speech Settings</h2>
      <div style={stateTheme.popup.dialog.content.seventyWidth}>
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
        <RangeSlider
          header='Amplitude'
          val={ttsAmplitude}
          maxValue={100}
          hasHeader={true}
          onValueChanged={value => {
            setTTSAmplitude(value);
            saveToDB('tts_Amplitude', value);
          }}
          stateTheme={stateTheme}
        />
        <RangeSlider
          header='Pitch'
          val={ttsPitch}
          maxValue={200}
          hasHeader={true}
          onValueChanged={value => {
            setTTSPitch(value);
            saveToDB('tts_Pitch', value);
          }}
          stateTheme={stateTheme}
        />
        <RangeSlider
          header='Speed'
          val={ttsSpeed}
          maxValue={300}
          hasHeader={true}
          onValueChanged={value => {
            setTTSSpeed(value);
            saveToDB('tts_Speed', value);
          }}
          stateTheme={stateTheme}
        />
        {/*<Slider header="Word Gap" val={ttsWordGap} valType={"ms"} maxValue={100} hasHeader={true} onChange={(e, value) => {setTTSWordGap(value); saveToDB("tts_WordGap", value);}} style={styles}/>*/}
      </div>
      <div style={stateTheme.popup.dialog.buttonStack}>
        <Button
          title={'Test TTS'}
          isSubmit={true}
          stateTheme={stateTheme}
          buttonStyle={{ width: '-webkit-fill-available' }}
          onClick={() => {
            var utter = new SpeechSynthesisUtterance();
            utter.text = 'I scream, you scream, we all scream for ice cream';
            utter.volume = config.tts_Amplitude / 100;
            utter.pitch = config.tts_Pitch / 100;
            utter.rate = config.tts_Speed / 100;
            utter.onend = () => {};
            speechSynthesis.speak(utter);
          }}
        />
        <Button
          title={'Close'}
          isSubmit={true}
          stateTheme={stateTheme}
          buttonStyle={{
            width: '-webkit-fill-available',
            'margin-left': '10px'
          }}
          onClick={() => {
            closeCurrentPopup();
          }}
        />
      </div>
    </div>
  );
};

export { ChatTextToSpeechPopup };