import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace, MdPlayArrow } from 'react-icons/md';

import { Message } from './Message';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

// Generic Components
import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';
import { Panel } from '../Generics/Panel';
import {
  Button,
  DestructiveButton,
  ActionButton,
  WidgetButton,
  SendButton
} from '../Generics/Button';
import { TextField, StepperField } from '../Generics/Input';
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

let followTimeout;
let subTimeout;
let giftedSubTimeout;
let lemonTimeout;
let icecreamTimeout;
let diamondTimeout;
let ninjaTimeout;
let ninjetTimeout;

const ChatEventsPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [config, setConfig] = useState(Config);
  const [enableEventMessages, setEnableEventMessages] = useState(true);

  const [onFollow, setOnFollow] = useState('');
  const [onSub, setOnSub] = useState('');
  const [onGiftedSub, setOnGiftedSub] = useState('');
  const [onLemon, setOnLemon] = useState('');
  const [onIcecream, setOnIcecream] = useState('');
  const [onDiamond, setOnDiamond] = useState('');
  const [onNinja, setOnNinja] = useState('');
  const [onNinjet, setOnNinjet] = useState('');

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;

      let eventConfig = Object.assign(
        {},
        {
          enableEventMessages: true,
          onFollow: 'Thank you for the follow $USER!',
          onSub: 'Thank you for subscribing, $USER!',
          onGiftedSub: 'Thank you for gifting a sub, $USER!',
          onLemon: '',
          onIcecream: "I'm gonna get a brainfreeze because of you $USER!",
          onDiamond: 'Ooo shiny 💎 thank you, $USER!',
          onNinja: '*smoke bomb* Thanks for that Ninjaghini $USER!',
          onNinjet: "Holy smokes! You're the best $USER! 😲"
        },
        data.eventConfig
      );
      setConfig(data);
      setEnableEventMessages(eventConfig.enableEventMessages);
      setOnFollow(eventConfig.onFollow);
      setOnSub(eventConfig.onSub);
      setOnGiftedSub(eventConfig.onGiftedSub);
      setOnLemon(eventConfig.onLemon);
      setOnIcecream(eventConfig.onIcecream);
      setOnDiamond(eventConfig.onDiamond);
      setOnNinja(eventConfig.onNinja);
      setOnNinjet(eventConfig.onNinjet);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  let updateEnableEvents = bool => {
    let tConfig = Object.assign({}, config.eventConfig);
    tConfig.enableEventMessages = !bool;
    setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
  };

  let updateFollow = val => {
    if (val.length > 500) return;
    if (followTimeout) {
      clearTimeout(followTimeout);
    }
    setOnFollow(val);
    followTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onFollow = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateSub = val => {
    if (val.length > 500) return;
    if (subTimeout) {
      clearTimeout(subTimeout);
    }
    setOnSub(val);
    subTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onSub = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateGiftedSub = val => {
    if (val.length > 500) return;
    if (giftedSubTimeout) {
      clearTimeout(giftedSubTimeout);
    }
    setOnGiftedSub(val);
    giftedSubTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onGiftedSub = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateLemon = val => {
    if (val.length > 500) return;
    if (lemonTimeout) {
      console.log('there is a timeout right now', 750);
      clearTimeout(lemonTimeout);
    }
    setOnLemon(val);
    lemonTimeout = setTimeout(() => {
      console.log('excuting rxConfig set');
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onLemon = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
      console.log('done');
    }, 750);
  };

  let updateIcecream = val => {
    if (val.length > 500) return;
    if (icecreamTimeout) {
      clearTimeout(icecreamTimeout);
    }
    setOnIcecream(val);
    icecreamTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onIcecream = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateDiamond = val => {
    if (val.length > 500) return;
    if (diamondTimeout) {
      clearTimeout(diamondTimeout);
    }
    setOnDiamond(val);
    diamondTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onDiamond = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateNinja = val => {
    if (val.length > 500) return;
    if (ninjaTimeout) {
      clearTimeout(ninjaTimeout);
    }
    setOnNinja(val);
    ninjaTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onNinja = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  let updateNinjet = val => {
    if (val.length > 500) return;
    if (ninjetTimeout) {
      clearTimeout(ninjetTimeout);
    }
    setOnNinjet(val);
    ninjetTimeout = setTimeout(() => {
      let tConfig = Object.assign({}, config.eventConfig);
      tConfig.onNinjet = val;
      setRxConfig(Object.assign({}, config, { eventConfig: tConfig }));
    }, 750);
  };

  return (
    <div className={`${styles.popup}`}>
      <h2>Chat on Events</h2>
      <div className={`${styles.chatFilterPopup}`}>
        <Toggle
          header='Send Event Messages'
          type={ToggleType.stretched}
          isEnabled={true}
          isOn={enableEventMessages}
          onClick={() => {
            updateEnableEvents(enableEventMessages);
          }}
          stateTheme={stateTheme}
        />
        <Panel
          header={enableEventMessages ? null : 'Event Messages Disabled'}
          hasHeader={!enableEventMessages}
          style={stateTheme.base.tertiaryBackground}
          stateTheme={stateTheme}
          content={
            enableEventMessages ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'On Follow'}
                      placeholderText='No message...'
                      stateTheme={stateTheme}
                      width={'100%'}
                      text={onFollow}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateFollow(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'On Sub'}
                      placeholderText='No message...'
                      stateTheme={stateTheme}
                      width={'100%'}
                      text={onSub}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateSub(e.target.value);
                        // if (!isNaN(Number(e.target.value)) || e.target.value === '')
                        //   setPoints(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'On Gift Sub'}
                      placeholderText='No message...'
                      stateTheme={stateTheme}
                      text={onGiftedSub}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateGiftedSub(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
              </div>
            ) : null
          }
        />
        <Panel
          header={
            enableEventMessages
              ? 'Donation Messages'
              : 'Event Messages Disabled'
          }
          hasHeader={true}
          style={Object.assign(
            {},
            { marginTop: '10px' },
            stateTheme.base.tertiaryBackground
          )}
          stateTheme={stateTheme}
          content={
            enableEventMessages ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      placeholderText='No message...'
                      header={'Lemon'}
                      stateTheme={stateTheme}
                      text={onLemon}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        console.log('UPDATING LEMON', e.target.value);
                        updateLemon(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'Icecream'}
                      placeholderText='No message...'
                      text={onIcecream}
                      stateTheme={stateTheme}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateIcecream(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'Diamond'}
                      placeholderText='No message...'
                      text={onDiamond}
                      stateTheme={stateTheme}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateDiamond(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'Ninjaghini'}
                      placeholderText='No message...'
                      text={onNinja}
                      stateTheme={stateTheme}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateNinja(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <TextField
                      header={'Ninjet'}
                      placeholderText='No message...'
                      text={onNinjet}
                      stateTheme={stateTheme}
                      width={'100%'}
                      inputStyle={stateTheme.base.secondaryBackground}
                      onChange={e => {
                        updateNinjet(e.target.value);
                      }}
                    />
                  </div>
                  <SendButton
                    icon={
                      <MdPlayArrow style={{ height: '25px', width: '25px' }} />
                    }
                    stateTheme={stateTheme}
                    buttonStyle={{
                      marginTop: '21px',
                      marginBottom: '10px',
                      maxHeight: '30px'
                    }}
                    onClick={() => {}}
                  />
                </div>
              </div>
            ) : null
          }
        />
      </div>
      <Button
        title={'Close'}
        isSubmit={true}
        stateTheme={stateTheme}
        onClick={() => {
          setTimeout(() => {
            closeCurrentPopup();
          }, 400);
        }}
      />
    </div>
  );
};

export { ChatEventsPopup };
