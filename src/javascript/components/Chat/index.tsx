import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import {
  MdSend,
  MdPerson,
  MdMood,
  MdFace,
  MdLocalMovies,
  MdEvent,
  MdFilterList,
  MdSettingsVoice
} from 'react-icons/md';

import { Message } from './Message';
import { StickerPopup } from './StickerPopup';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { firebaseEmotes$, setRxEmotes } from '../../helpers/rxEmotes';
import { Action } from 'rxjs/internal/scheduler/Action';
import { remote } from 'electron';
import { CreativeBotPopup } from './../WebServices/CreativeBotPopup';
import { ChatFiltersPopup } from './ChatFiltersPopup';
import { ChatTextToSpeechPopup} from './ChatTextToSpeechPopup';
import { AdvancedDiv } from '../AdvancedDiv';
import { firebase } from '../../helpers/firebase';

import { isEmpty, isEqual } from 'lodash';

import {
  initLogin,
  signUp as SignUp,
  rxFirebaseuser
} from '../../helpers/firebase';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { SetupOptionsPopup } from './SetupOptionsPopup';
import { SetupAsExistingUserPopup } from './SetupAsExistingUserPopup';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');
const { BrowserWindow } = remote;

let authKey = false;
let streamerDisplayName = false;

const styles: any = require('./Chat.scss');
interface popup {
  styles: any;
  closeCurrentPopup?: any;
  addPopup: any;
  stateTheme: any;
  configName?: any;
  text?: string | Function | Element | any;
  buttonText?: string | Function | Element;
  noInput?: boolean;
  Config?: any;
  type?: string;
}

function validateStringForEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const AddAcceptFirebasePopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  configName,
  Config = {}
}: popup) => {
  let [signUp, setSignUp] = useState(false);
  let [email, setEmail] = useState('');
  let [emailErr, setEmailErr] = useState('');
  let [password, setPassword] = useState('');
  let [passwordErr, setPasswordErr] = useState('');
  let [confirmationPassword, setConfirmationPassword] = useState('');
  let [confErr, setConfErr] = useState('');

  let validateEmail = val => {
    if (!validateStringForEmail(val) && signUp) {
      setEmailErr('Invalid email address!');
    } else {
      setEmailErr('');
    }
    setEmail(val);
  };

  let validateConfirmationPassword = val => {
    if (val !== password) {
      setConfErr('Passwords do not match!');
    } else {
      setConfErr('');
    }
    setConfirmationPassword(val);
    // runAllValidate();
  };
  let validatePassword = val => {
    if (val.length < 8 && signUp) {
      setPasswordErr('Password must be 8 character long!');
    } else {
      setPasswordErr('');
    }
    setPassword(val);
    setConfirmationPassword(confirmationPassword);
  };

  return (
    <div className={styles.popup}>
      <h1>CreativeBot Sign-in</h1>
      <p
        style={{
          width: '70%',
          margin: 'auto',
          paddingTop: '10px',
          paddingBottom: '10px',
          textAlign: 'center',
          fontSize: '0.8em'
        }}
      >
        Sign in to the cloud to save all commands/timers/etc plus some more
        awesome features!
      </p>
      <React.Fragment>
        <div className={styles.input_name}>Email</div>
        <input
          className={styles.input}
          type={'email'}
          onChange={e => {
            validateEmail(e.target.value);
          }}
          value={email}
          style={{ width: 'calc(70% - 10px)', minWidth: 'unset' }}
        />
        {emailErr ? (
          <div
            style={{
              paddingBottom: '10px',
              color: theme.globals.destructiveButton.backgroundColor
            }}
          >
            {emailErr}
          </div>
        ) : null}
      </React.Fragment>
      <React.Fragment>
        <div className={styles.input_name}>
          Password{' '}
          {!signUp && emailErr.length === 0 ? (
            <AdvancedDiv
              style={{
                fontSize: '0.7em',
                color: theme.globals.accentHighlight.highlightColor
              }}
              hoverStyle={{ cursor: 'pointer' }}
            >
              <span
                onClick={() => {
                  if (emailErr) {
                    setEmailErr(
                      'Cannot send password request to email with no user!'
                    );
                  } else if (!validateStringForEmail(email)) {
                    setEmailErr(
                      'Cannot send password request to email with no user!'
                    );
                  } else {
                    firebase
                      .auth()
                      .sendPasswordResetEmail(email)
                      .then(() => {
                        setEmailErr('Check email for password reset link!');
                      })
                      .catch(e => {
                        if (e.message) {
                          setEmailErr(e.message);
                        }
                      });
                  }
                }}
              >
                Forgot Password?
              </span>
            </AdvancedDiv>
          ) : null}
        </div>
        <input
          className={styles.input}
          onKeyDown={e => {}}
          type={'password'}
          onChange={e => {
            validatePassword(e.target.value);
          }}
          style={{ width: 'calc(70% - 10px)', minWidth: 'unset' }}
          value={password}
        />
        {passwordErr ? (
          <div
            style={{
              paddingBottom: '10px',
              color: theme.globals.destructiveButton.backgroundColor
            }}
          >
            {passwordErr}
          </div>
        ) : null}
      </React.Fragment>
      {signUp ? (
        <React.Fragment>
          <div className={styles.input_name}>Confirm Password</div>
          <input
            className={styles.input}
            onKeyDown={e => {}}
            type={'password'}
            style={{ width: 'calc(70% - 10px)', minWidth: 'unset' }}
            onChange={e => {
              validateConfirmationPassword(e.target.value);
            }}
            value={confirmationPassword}
          />
          {confErr ? (
            <div
              style={{
                paddingBottom: '10px',
                color: theme.globals.destructiveButton.backgroundColor
              }}
            >
              {confErr}
            </div>
          ) : null}
        </React.Fragment>
      ) : null}
      {signUp ? (
        <div
          className={`${styles.submit} ${
            confErr.length === 0 &&
            passwordErr.length === 0 &&
            emailErr.length === 0
              ? styles.enabled
              : styles.disabled
          }`}
          onClick={() => {
            SignUp(email, password)
              .then(boop => {
                closeCurrentPopup({
                  uid: boop.user.uid,
                  refreshToken: boop.user.refreshToken
                });
              })
              .catch(e => {
                if (e.message) {
                  setEmailErr(e.message);
                }
              });
          }}
        >
          Create Account
        </div>
      ) : (
        <div
          className={`${styles.submit} ${styles.enabled}`}
          onClick={() => {
            initLogin(email, password)
              .then(boop => {
                closeCurrentPopup({
                  uid: boop.user.uid,
                  refreshToken: boop.user.refreshToken
                });
              })
              .catch(e => {
                if (e.code.includes('wrong-password')) {
                  if (e.message) {
                    setPasswordErr(`Invalid password.`);
                  }
                } else if (e.code.includes('user-not-found')) {
                  setEmailErr(`User not found.`);
                }
              });
          }}
        >
          Login
        </div>
      )}
      <div style={{ display: 'flex', marginTop: '10px' }}>
        {signUp ? (
          <AdvancedDiv
            aStyle={{
              flex: 1,
              paddingRight: '5px',
              textAlign: 'center',
              maxWidth: '100%'
            }}
            hoverStyle={Object.assign(
              {},
              { cursor: 'pointer' },
              { color: theme.globals.accentHighlight.highlightColor }
            )}
          >
            <div
              onClick={() => {
                setSignUp(false);
              }}
            >
              Sign in
            </div>
          </AdvancedDiv>
        ) : (
          <React.Fragment>
            <AdvancedDiv
              aStyle={{
                flex: 1,
                paddingRight: '5px',
                textAlign: 'center',
                maxWidth: '100%'
              }}
              hoverStyle={Object.assign(
                {},
                { cursor: 'pointer' },
                { color: theme.globals.accentHighlight.highlightColor }
              )}
            >
              <div
                onClick={() => {
                  setSignUp(true);
                }}
              >
                Sign up
              </div>
            </AdvancedDiv>
            {/* <AdvancedDiv
              aStyle={{
                flex: 1,
                paddingLeft: '5px',
                textAlign: 'center',
                maxWidth: '50%'
              }}
              hoverStyle={Object.assign(
                {},
                { cursor: 'pointer' },
                { color: theme.globals.accentHighlight.highlightColor }
              )}
            >
              <div
                onClick={e => {
                  closeCurrentPopup(false);
                }}
              >
                No thanks, I don't like awesome content
              </div>
            </AdvancedDiv> */}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

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

  const setError = (error, disableTimeout = false, skipTimeout = false) => {
    if (skipTimeout) {
      SetError(false);
      SetHelperText(text);
      return;
    }
    SetError(true);
    SetHelperText(error);
    if (disableTimeout) return;
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
      verifySave();
    }
  };

  let verifyInput = val => {
    if (configName === 'Auth Key' && val.split('.').length !== 3) {
      setError(true, true);
      SetHelperText('That doesnt look like a valid auth key!');
    } else if (configName === 'Auth Key' && error) {
      setError('', false, true);
    }
    setName(val);
  };

  let verifySave = () => {
    if (error) return;
    closeCurrentPopup(name, setError);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.input_wrapper}>
        {noInput ? null : (
          <React.Fragment>
            <div className={styles.input_name}>{configName}</div>
            <input
              className={styles.input}
              onKeyDown={keyDown}
              type={type}
              onChange={e => {
                verifyInput(e.target.value);
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
        className={`${styles.submit} ${
          error ? styles.disabled : styles.enabled
        }`}
        style={
          error ? stateTheme.disabledSubmitButton : stateTheme.submitButton
        }
        onClick={() => {
          verifySave();
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
  const [emotes, setEmotes]: any = useState({});
  const [firstRender, setFirstRender] = useState(true);

  const [isStartUp, setIsStartUp] = useState<Boolean>(
    config.streamerDisplayName == null
  );

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

  const changeTheme = (themeVal: String) => {
    if (themeVal == 'dark') {
      setStateTheme(theme.dark);
    } else if (themeVal == 'light') {
      setStateTheme(theme.light);
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
    let listener = firebaseConfig$
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .subscribe((data: any) => {
        delete data.first;
        setConfig(data);
        setIsStartUp(data.streamerDisplayName == null);
      });
    let emoteslistener = firebaseEmotes$.subscribe((data: any) => {
      delete data.first;
      setEmotes(data);
    });
    return () => {
      emoteslistener.unsubscribe();
      listener.unsubscribe();
    };
  }, []);

  const openStickerPanel = () => {
    addPopup(
      <StickerPopup
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        text={<span>Stickers</span>}
        Emotes={emotes}
      />
    );
  };

  const openTidyClips = () => {
    /*let win = new BrowserWindow({ width: 1024, height: 600 })
    win.loadURL('https://clips.tidylabs.stream/generate?clippedby=TidyClips+Website&url=CreativeBuilds')*/
    addPopup(
      <CreativeBotPopup
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />,
      true
    );
  };

  const openChatFiltersPanel = () => {
    addPopup(
      <ChatFiltersPopup
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />
    );
  };

  useEffect(() => {
    if (isScrolledUp) return;
    document.getElementById('bottomOfMessages').scrollIntoView();
  }, [Messages]);

  useEffect(() => {
    // Test to see if the config includes the right variables
    // if's at the top of this will be rendered last

    let showExistingUserPopup = false;
    // if (!config.init) return;
    if (
      !!config.authKey &&
      !config.streamerDisplayName &&
      config.init &&
      !streamerDisplayName &&
      config.acceptedToS &&
      typeof config.isFirebaseUser !== 'undefined' &&
      (config.isFirebaseUser ? config.loadedFirebaseConfig : true)
    ) {
      streamerDisplayName = true;
      addPopup(
        <AddCommandPopup
          styles={styles}
          addPopup={addPopup}
          closeCurrentPopup={(input, setError) => {
            if (input !== '') {
              let Config = Object.assign(
                {},
                { streamerDisplayName: input },
                config
              );
              setRxConfig(Config);
              let passedConfig = () => {
                closeCurrentPopup();
                ipcRenderer.removeListener('failedConfig', failedConfig);
              };
              let failedConfig = (obj, err) => {
                window.location.reload();
                ipcRenderer.removeListener('passedConfig', passedConfig);
              };
              ipcRenderer.once('passedConfig', passedConfig);
              ipcRenderer.once('failedConfig', failedConfig);
            } else {
              setError('Input field must not be empty!');
            }
          }}
          stateTheme={stateTheme}
          configName={'Streamer Username'}
          text={
            'Note if, you input the incorrect name, you can change later in the options file.'
          }
        />,
        false,
        true
      );
    }
    if (
      !config.authKey &&
      config.init &&
      !authKey &&
      !config.streamerDisplayName &&
      config.acceptedToS &&
      typeof config.isFirebaseUser !== 'undefined' &&
      (config.isFirebaseUser ? config.loadedFirebaseConfig : true)
    ) {
      authKey = true;
      addPopup(
        <AddCommandPopup
          styles={styles}
          addPopup={addPopup}
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
                style={{ color: theme.globals.accentHighlight.highlightColor }}
                onClick={e => {
                  e.preventDefault();
                  shell.openExternal(
                    'https://github.com/CreativeBuilds/creative-bot/blob/master/FINDAUTHKEY.md'
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
        />,
        false,
        true
      );
    }

    if (config.acceptedToS && typeof config.isFirebaseUser === 'undefined') {
      addPopup(
        <AddAcceptFirebasePopup
          styles={styles}
          addPopup={addPopup}
          closeCurrentPopup={obj => {
            let Config = Object.assign(
              {},
              !!obj
                ? { refreshToken: obj.refreshToken, isFirebaseUser: obj.uid }
                : { isFirebaseUser: false },
              config
            );
            setRxConfig(Config);
            closeCurrentPopup();
          }}
          stateTheme={stateTheme}
        />,
        false,
        true
      );
    }
    // if (
    //   !config.streamerDisplayName &&
    //   isStartUp &&
    //   config.acceptedToS &&
    //   config.isFirebaseUser === false
    // ) {
    //   addPopup(
    //     <SetupOptionsPopup
    //       styles={styles}
    //       closeCurrentPopup={closeCurrentPopup}
    //       addPopup={addPopup}
    //       stateTheme={stateTheme}
    //       setupAsNewUser={e => {}}
    //       setupAsExistingUser={e => {
    //         setTimeout(function() {
    //           addPopup(
    //             <SetupAsExistingUserPopup
    //               styles={styles}
    //               closeCurrentPopup={closeCurrentPopup}
    //               addPopup={addPopup}
    //               stateTheme={stateTheme}
    //             />
    //           );
    //         }, 8);
    //       }}
    //     />
    //   );
    // }
    if (!config.acceptedToS && config.init) {
      addPopup(
        <AddCommandPopup
          styles={styles}
          addPopup={addPopup}
          closeCurrentPopup={() => {
            let Config = Object.assign({}, { acceptedToS: true }, config);
            setRxConfig(Config);
            closeCurrentPopup();
          }}
          stateTheme={stateTheme}
          configName={''}
          text={
            <span>
              Welcome to Creative's Chat Bot!
              <br /> Before we can do cool things, you're going to have to fill
              in some config options...
              <br />
              <br />
              <i>
                Please note, by continuing you agree that non-identifying
                information may be collected for statistical use to help further
                development of the bot *
              </i>
            </span>
          }
          noInput={true}
        />,
        false,
        true
      );
    }
  }, [config]);

  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Chat}>
      <div
        style={Object.assign(
          {},
          stateTheme.toolBar,
          stateTheme.base.quinaryForeground
        )}
        className={styles.header}
      >
        CHAT
        <div className={styles.rightContainer}>
          <div
            className={styles.events}
            onClick={() => {
              addPopup(
                <ChatTextToSpeechPopup
                  stateTheme={stateTheme}
                  styles={styles}
                  Config={Object.assign({}, config)}
                  closeCurrentPopup={closeCurrentPopup}
                />
              );
            }}
          >
            <MdSettingsVoice />
            <span> </span>
          </div>
          <div
            className={styles.events}
            onClick={() => {
              openChatFiltersPanel();
            }}
          >
            <MdFilterList />
            <span> </span>
          </div>
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
      </div>
      <div style={{}} className={styles.content} id='messages'>
        {Messages.map((message, nth) => {
          if (
            !message.content ||
            (message.content ? message.content.length === 0 : true)
          )
            return null;
          return (
            <Message
              addPopup={addPopup}
              Config={config}
              styles={styles}
              message={message}
              closeCurrentPopup={closeCurrentPopup}
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
      <div style={stateTheme.base.secondaryBackground} className={styles.input}>
        {/* TODO change maxLength to be limitless and then send messages once every 2 seconds to get around chat slowmode */}
        <textarea
          style={Object.assign({}, stateTheme.base.quinaryBackground, {
            borderColor: stateTheme.base.quinaryBackground.backgroundColor
          })}
          value={text}
          maxLength={280}
          onKeyDown={onEnterPress}
          onChange={e => {
            updateText(e);
          }}
        />
        {/*<div
          className={styles.send}
          style={Object.assign({}, stateTheme.base.quinaryBackground, {
            borderColor: stateTheme.base.quinaryBackground.backgroundColor
          })}
          onClick={openTidyClips}
        >
          <MdLocalMovies />
        </div>*/}
        <div
          className={styles.send}
          style={Object.assign({}, stateTheme.base.quinaryBackground, {
            borderColor: stateTheme.base.quinaryBackground.backgroundColor
          })}
          onClick={openStickerPanel}
        >
          <MdFace />
        </div>
        <div
          className={styles.send}
          style={Object.assign({}, stateTheme.base.quinaryBackground, {
            borderColor: stateTheme.base.quinaryBackground.backgroundColor
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
