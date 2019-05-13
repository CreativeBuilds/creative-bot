import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood } from 'react-icons/md';

import { Message } from './Message';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

let authKey = false;
let streamerDisplayName = false;

const styles: any = require('./Chat.scss');
interface popup {
  styles: any;
  closeCurrentPopup: any;
  stateTheme: any;
  configName?: any;
  text?: string | Function | Element | any;
  buttonText?: string | Function | Element;
  noInput?: boolean;
  Config?: any;
  type?: string;
}

const AddCommandPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  configName,
  text = '',
  buttonText = 'NEXT',
  noInput = false,
  Config = {},
  type = 'text'
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

  useEffect(() => {
    if (JSON.stringify(Config) !== JSON.stringify(config)) {
      setConfig(Config);
      setName('');
      if (configName === 'Auth Key' && Config.authKey) {
        closeCurrentPopup();
      }
    }
  }, [Config]);

  let keyDown = e => {
    if (e.key === 'Enter') {
      closeCurrentPopup(name, setError);
    }
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.input_wrapper}>
        {noInput ? null : (
          <React.Fragment>
            <div className={styles.input_name}>{configName}</div>
            <input
              className={styles.input}
              onKeyDown={keyDown}
              type={type}
              onChange={e => {
                setName(e.target.value);
              }}
              value={name}
            />
          </React.Fragment>
        )}
      </div>
      <div
        className={styles.helper_text}
        style={isError() ? { color: 'red' } : {}}
      >
        {helperText}
      </div>
      <div
        className={styles.submit}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
        }}
        onClick={() => {
          closeCurrentPopup(name, setError);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

const Chat = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [text, setText] = useState('');
  const { Messages, addPopup, closeCurrentPopup } = props;
  const viewers = props.viewers;

  const [viewersToggle, setViewersToggle] = useState<boolean>(true);
  const [config, setConfig]: any = useState({});
  const [firstRender, setFirstRender] = useState(true);

  const updateText = e => {
    setText(e.target.value);
  };

  const sendMessage = () => {
    ipcRenderer.send('sendmessage', { from: 'bot', message: text });
    setText('');
  };

  const onEnterPress = e => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    let element: any = document.getElementById('messages');
    element.addEventListener('scroll', function(event) {
      var element = event.target;
      if (
        element.scrollHeight - element.scrollTop - 20 <=
        element.clientHeight
      ) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }
    });
    let listener = rxConfig.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isScrolledUp) return;
    document.getElementById('bottomOfMessages').scrollIntoView();
  }, [Messages]);

  useEffect(() => {
    // Test to see if the config includes the right variables
    // if's at the top of this will be rendered last
    if (!config.init) return;
    if (
      !config.authKey &&
      config.init &&
      !authKey &&
      config.streamerDisplayName
    ) {
      authKey = true;
      addPopup(
        <AddCommandPopup
          styles={styles}
          Config={Object.assign({}, config)}
          closeCurrentPopup={(input, setError) => {
            if (input !== '') {
              let Config = Object.assign({}, { authKey: input }, config);
              setRxConfig(Config);
              closeCurrentPopup();
            } else {
              setError('Input field must not be empty!');
            }
          }}
          stateTheme={stateTheme}
          configName={'Auth Key'}
          type={'password'}
          text={
            <div>
              Check the instructions on how to get your Auth Key from DLive{' '}
              <span
                className={styles.link}
                style={{ color: stateTheme.main.highlightColor }}
                onClick={e => {
                  e.preventDefault();
                  shell.openExternal(
                    'https://github.com/CreativeBuilds/dlive-chat-bot/blob/master/FINDAUTHKEY.md'
                  );
                }}
              >
                here
              </span>
              <br /> note this is the account that will send messages, so if you
              want to use a bot account other than your main account, make sure
              to use that auth key!
            </div>
          }
        />
      );
    }
    if (!config.streamerDisplayName && config.init && !streamerDisplayName) {
      streamerDisplayName = true;
      addPopup(
        <AddCommandPopup
          styles={styles}
          closeCurrentPopup={(input, setError) => {
            if (input !== '') {
              let Config = Object.assign(
                {},
                { streamerDisplayName: input },
                config
              );
              setRxConfig(Config);
              closeCurrentPopup();
            } else {
              setError('Input field must not be empty!');
            }
          }}
          stateTheme={stateTheme}
          configName={'Streamer Username'}
          text={
            'Note if, you input the incorrect name, you can change later in the options file.'
          }
        />
      );
    }
    if (Object.keys(config).length === 1) {
      addPopup(
        <AddCommandPopup
          styles={styles}
          closeCurrentPopup={() => {
            closeCurrentPopup();
          }}
          stateTheme={stateTheme}
          configName={''}
          text={
            <span>
              Welcome to Creative's Chat Bot!
              <br /> Before we can do cool things, you're going to have to fill
              in some config options...
            </span>
          }
          noInput={true}
        />
      );
    }
  }, [config]);

  return (
    <div style={stateTheme.menu} className={styles.Chat}>
      <div style={stateTheme.menu.title} className={styles.header}>
        CHAT
        <div
          className={styles.viewers}
          onClick={() => {
            setViewersToggle(!viewersToggle);
          }}
        >
          <MdPerson />
          <span> {viewersToggle ? viewers : 'HIDDEN'}</span>
        </div>
      </div>
      <div style={{}} className={styles.content} id='messages'>
        {Messages.map((message, nth) => {
          return (
            <Message
              styles={styles}
              message={message}
              stateTheme={stateTheme}
              nth={nth}
              ownerName={(config.streamerDisplayName
                ? config.streamerDisplayName
                : ''
              ).toLowerCase()}
            />
          );
        })}
        <div id={'bottomOfMessages'} />
        {/* This is for the actual chat messages */}
      </div>
      <div style={stateTheme.menu['title_hover']} className={styles.input}>
        {/* TODO change maxLength to be limitless and then send messages once every 2 seconds to get around chat slowmode */}
        <textarea
          style={Object.assign({}, stateTheme.chat.input, {
            borderColor: stateTheme.chat.input.backgroundColor
          })}
          value={text}
          maxLength={140}
          onKeyDown={onEnterPress}
          onChange={e => {
            updateText(e);
          }}
        />
        <div
          className={styles.send}
          style={Object.assign({}, stateTheme.chat.input, {
            borderColor: stateTheme.chat.input.backgroundColor
          })}
          onClick={sendMessage}
        >
          <MdSend />
        </div>
      </div>
    </div>
  );
};

export { Chat };
