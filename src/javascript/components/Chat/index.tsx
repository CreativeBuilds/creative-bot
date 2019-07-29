import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import {
  MdSend,
  MdPerson,
  MdFace,
  MdSettingsVoice,
  MdSettings,
  MdVisibility,
  MdVisibilityOff,
  MdChatBubble,
  MdChat,
  MdArrowDownward
} from 'react-icons/md';

import { StickerPopup } from './StickerPopup';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { firebaseEmotes$ } from '../../helpers/rxEmotes';
import { remote } from 'electron';
import { ChatFiltersPopup } from './ChatFiltersPopup';
import { ChatTextToSpeechPopup } from './ChatTextToSpeechPopup';
import { firebase } from '../../helpers/firebase';

import {
  AdvancedDiv,
  Button,
  ActionButton,
  IconButton,
  WidgetButton,
  LinkButton,
  EmailField,
  PasswordField,
  MessageField,
  Message,
  Page, 
  PageHeader, 
  PageBody, 
  TextField
} from '../Generics/CreativeUI';

import { isEmpty, isEqual } from 'lodash';

import {
  initLogin,
  signUp as SignUp,
  rxFirebaseuser
} from '../../helpers/firebase';
import { filter, distinctUntilChanged, first } from 'rxjs/operators';
import { AccountsPopup } from './AccountsPopup';
import { ChatEventsPopup } from './ChatEventsPopup';
import { from } from 'rxjs';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');
const { BrowserWindow } = remote;

let authKey = false;
let streamerDisplayName = false;

//const styles: any = require('./Chat.scss');

interface popup {
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
    <div style={stateTheme.popup.dialog.content}>
      <h1 style={{ marginBottom: '0px' }}>CreativeBot Sign-in</h1>
      <div style={stateTheme.popup.dialog.content.seventyWidth}>
        <p
          style={{
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
          <EmailField
            header={'Email'}
            placeholderText={'Email'}
            stateTheme={stateTheme}
            style={{ marginBottom: '10px' }}
            inputStyle={stateTheme.base.secondaryBackground}
            onChange={e => {
              validateEmail(e.target.value);
            }}
          />
          {emailErr ? (
            <div
              style={{
                paddingBottom: '10px',
                color: theme.globals.destructive.backgroundColor
              }}
            >
              {emailErr}
            </div>
          ) : null}
        </React.Fragment>
        <React.Fragment>
          <PasswordField
            header={'Password'}
            placeholderText={'Password'}
            hasForgotLabel={!signUp && emailErr.length === 0 ? true : false}
            onForgotPassword={() => {
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
            stateTheme={stateTheme}
            style={{ marginBottom: '10px' }}
            inputStyle={stateTheme.base.secondaryBackground}
            onChange={e => {
              validatePassword(e.target.value);
            }}
          />
          {passwordErr ? (
            <div
              style={{
                paddingBottom: '10px',
                color: theme.globals.destructive.backgroundColor
              }}
            >
              {passwordErr}
            </div>
          ) : null}
        </React.Fragment>
        {signUp ? (
          <React.Fragment>
            <PasswordField
              header={'Confirm Password'}
              placeholderText={'Confirm Password'}
              stateTheme={stateTheme}
              style={{ marginBottom: '10px' }}
              inputStyle={stateTheme.base.secondaryBackground}
              onChange={e => {
                validateConfirmationPassword(e.target.value);
              }}
            />
            {confErr ? (
              <div
                style={{
                  paddingBottom: '10px',
                  color: theme.globals.destructive.backgroundColor
                }}
              >
                {confErr}
              </div>
            ) : null}
          </React.Fragment>
        ) : null}
        {signUp ? (
          <Button
            title={'Create Account'}
            isSubmit={true}
            stateTheme={stateTheme}
            isEnabled={
              confErr.length === 0 &&
              passwordErr.length === 0 &&
              emailErr.length === 0
                ? true
                : false
            }
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
          />
        ) : (
          <Button
            title={'Login'}
            isSubmit={true}
            stateTheme={stateTheme}
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
          />
        )}
        <div style={{ display: 'flex', marginTop: '10px' }}>
          {signUp ? (
            <LinkButton
              title={'Sign In'}
              isSubmit={true}
              stateTheme={stateTheme}
              buttonStyle={{ width: '100%' }}
              onClick={() => {
                setSignUp(false);
              }}
            />
          ) : (
            <React.Fragment>
              <LinkButton
                title={'Sign Up'}
                isSubmit={true}
                stateTheme={stateTheme}
                buttonStyle={{ width: '100%' }}
                onClick={() => {
                  setSignUp(true);
                }}
              />
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
    </div>
  );
};

const AddCommandPopup = ({
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
    <div style={stateTheme.popup.dialog.content}>
      <div style={stateTheme.popup.dialog.content.seventyWidth}>
        {noInput ? null : (
          <React.Fragment>
            <TextField 
              header={configName} 
              stateTheme={stateTheme} 
              onKeyDown={keyDown} 
              onChange={e => { 
                verifyInput(e.target.value);
              }}
              text={name}/>
          </React.Fragment>
        )}
      </div>
      <div
        style={Object.assign({}, 
          isError() ? { color: 'red' } : {}, 
          stateTheme.popup.dialog.helperText)
        }
      >
        {helperText}
      </div>
      <Button
        title={buttonText}
        isSubmit={true}
        buttonStyle={{ width: '70%', marginTop: '10px' }}
        isEnabled={error ? false : true}
        stateTheme={stateTheme}
        onClick={() => {
          verifySave();
        }}
      />
    </div>
  );
};

const LoginWithDlivePopup = ({
  closeCurrentPopup,
  stateTheme,
  configName,
  text = '',
  buttonText = 'NEXT',
  noInput = false,
  Config = {},
  type = 'text'
}: popup) => {
  return (
    <div style={stateTheme.popup.dialog.content}>
      <h3 style={{ margin: '0px', marginBottom: '5px' }}>
        BOT ACCOUNT SIGN IN!
      </h3>
      <i
        style={{
          textAlign: 'center',
          width: '70%',
          margin: 'auto',
          marginBottom: '15px'
        }}
      >
        Please do not use your streamer account,{' '}
        <b>make a seperate bot account</b>
      </i>
      <div
        style={{
          display: 'block',
          justifyContent: 'center',
          alignItems: 'center',
          width: '70%',
        }}
      >
        <ActionButton
          title={'Save'}
          buttonStyle={{ width: '100%' }}
          stateTheme={stateTheme}
          onClick={e => {
            // Need to create a popup that is oauth for dlive
            ipcRenderer.send('oauthWindowStart');
            ipcRenderer.once('newAuthKey', (event, key) => {
              closeCurrentPopup(key);
            });
          }}
        />
        <LinkButton
          title={'Sign Out'}
          buttonStyle={{ width: '100%', marginBottom: '0px !important' }}
          stateTheme={stateTheme}
          onClick={() => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                ipcRenderer.send('logout');
                setTimeout(() => {
                  window.close();
                }, 500);
              });
          }}
        />
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
        Config={Object.assign({}, config)}
        text={<span>Stickers</span>}
        Emotes={emotes}
      />
    );
  };

  const openTidyClips = () => {
    /*let win = new BrowserWindow({ width: 1024, height: 600 })
    win.loadURL('https://clips.tidylabs.stream/generate?clippedby=TidyClips+Website&url=CreativeBuilds')*/
    /*addPopup(
      <CreativeBotPopup
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />,
      true
    );*/
  };

  const openChatFiltersPanel = () => {
    addPopup(
      <ChatFiltersPopup
        stateTheme={stateTheme}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />
    );
  };

  const openAccountsPannel = () => {
    addPopup(
      <AccountsPopup
        stateTheme={stateTheme}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />,
      false,
      true
    );
  };
  const openChatEventsPannel = () => {
    addPopup(
      <ChatEventsPopup
        stateTheme={stateTheme}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />,
      false,
      true
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
      // !config.streamerDisplayName &&
      config.acceptedToS &&
      typeof config.isFirebaseUser !== 'undefined' &&
      (config.isFirebaseUser ? config.loadedFirebaseConfig : true)
    ) {
      authKey = true;
      addPopup(
        <LoginWithDlivePopup
          addPopup={addPopup}
          Config={Object.assign({}, config)}
          closeCurrentPopup={(input, setError) => {
            if (input !== '') {
              let Config = Object.assign({}, config, { authKey: input });
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
                style={Object.assign({}, { color: theme.globals.accentHighlight.highlightColor }, stateTheme.text.link)}
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
              <h3 style={{ marginBottom: '5px' }}>Welcome to Creative's Chat Bot!</h3>
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
    <Page stateTheme={stateTheme} style={stateTheme.base.tertiaryBackground}>
      <PageHeader
        style={stateTheme.base.quinaryForeground}
        stateTheme={stateTheme}
      >
        CHAT
        <div style={stateTheme.page.header.rightContainer}>
          <WidgetButton
            icon={<MdSettingsVoice />}
            stateTheme={stateTheme}
            onClick={() => {
              addPopup(
                <ChatTextToSpeechPopup
                  stateTheme={stateTheme}
                  Config={Object.assign({}, config)}
                  closeCurrentPopup={closeCurrentPopup}
                />
              );
            }}
          />
          <WidgetButton
            icon={<MdSettings />}
            stateTheme={stateTheme}
            onClick={() => {
              openChatFiltersPanel();
            }}
          />
          <WidgetButton
            icon={<MdPerson />}
            stateTheme={stateTheme}
            onClick={() => {
              openAccountsPannel();
            }}
          />
          <WidgetButton
            icon={<MdChat />}
            stateTheme={stateTheme}
            onClick={() => {
              openChatEventsPannel();
            }}
          />
          <WidgetButton
            icon={viewersToggle ? (
              <MdVisibility style={{ paddingRight: '5px' }} />
            ) : (
              <MdVisibilityOff />
            )}
            style={{
              display: 'inline-flex',
              'justify-content': 'center',
              'align-items': 'center',
              transition: 'all 0.15s ease-in-out',
              height: '100%',
              'vertical-align': 'middle',
              'margin-bottom': '3px'
            }}
            stateTheme={stateTheme}
            onClick={() => {
              setViewersToggle(!viewersToggle);
            }}
            footer={
              <span> {viewersToggle ? viewers : null}</span>
            }
          />
        </div>
      </PageHeader>
      <PageBody stateTheme={stateTheme} id='messages'>
        {(Messages.length > 100 ? Messages.slice(-100) : Messages).map(
          (message, nth) => {
            if (
              !message.content ||
              (message.content ? message.content.length === 0 : true)
            )
              return null;
            return (
              <Message
                addPopup={addPopup}
                Config={config}
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
          }
        )}
        {isScrolledUp ? (
          <div
            style={stateTheme.button.scrollDown.container}
          >
            <AdvancedDiv
              style={Object.assign(
                {},
                stateTheme.button.scrollDown,
                stateTheme.base.tertiaryBackground
              )}
              hoverStyle={Object.assign({}, theme.globals.accentBackground, {
                cursor: 'pointer',
                fill: 'black'
              })}
            >
              <div
                onClick={() => {
                  document.getElementById('bottomOfMessages').scrollIntoView();
                }}
                style={{
                  color: `${theme.globals.accentBackground.color} !important`
                }}
              >
                <MdArrowDownward />
              </div>
            </AdvancedDiv>
          </div>
        ) : null}
        <div id={'bottomOfMessages'} />
        {/* This is for the actual chat messages */}
      </PageBody>
      <div
        style={Object.assign(
          {},
          stateTheme.base.secondaryBackground,
          stateTheme.messageBar
        )}
      >
        {/* TODO change maxLength to be limitless and then send messages once every 2 seconds to get around chat slowmode */}
        <MessageField
          placeholderText={'Type a Message...'}
          text={text}
          stateTheme={stateTheme}
          onKeyDown={onEnterPress}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        {/*<SendButton 
          icon={<MdLocalMovies />} 
          stateTheme={stateTheme} 
          onClick={openTidyClips} />*/}
        <IconButton
          icon={<MdFace />}
          style={{ 
            padding: '5px'  
          }}
          buttonStyle={{
            maxHeight: '48px',
            height: '48px'
          }}
          stateTheme={stateTheme}
          onClick={openStickerPanel}
        />
        <IconButton
          icon={<MdSend />}
          style={{ 
            padding: '5px'  
          }}
          buttonStyle={{
            maxHeight: '48px',
            height: '48px'
          }}
          stateTheme={stateTheme}
          onClick={sendMessage}
        />
      </div>
    </Page>
  );
};

export { Chat };