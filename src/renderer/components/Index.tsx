import { HashRouter, Route } from 'react-router-dom';
import * as React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useState, useEffect } from 'react';
import { Login } from './login/login';
import { rxUser } from '../helpers/rxUser';
import { Background } from './background';
import { TitleBar } from './TitleBar';
import styled, { createGlobalStyle } from 'styled-components';
import {
  filter,
  skip,
  first,
  withLatestFrom,
  flatMap,
  tap
} from 'rxjs/operators';
import { Menu } from './menu/Menu';
import { Chat } from './chat/chat';
import { LoginDlive } from './logindlive/loginDlive';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { rxEventsFromMain } from '../helpers/eventHandler';
import { Online, Offline } from 'react-detect-offline';

import ThemeProvider, { ThemeContextProvider } from './themeContext';

import {
  dropDownBoxBackgroundColor,
  dropDownBoxBorderColor,
  dropDownBoxHoverColor,
  dropDownBoxColor,
  dropDownBoxSelectedColor
} from '@/renderer/helpers/appearance';

import { rxWordMap } from '../helpers/rxWordMap';
import { rxEvents } from '../helpers/rxEvents';
import { rxConfig, updateConfig } from '../helpers/rxConfig';
import { rxChat, rxMessages } from '../helpers/rxChat';
import { Users } from './users/Users';
import { Themes } from './themes/themes';
import { start } from '../helpers/start';
import { IRXEvent, IConfig, IEvent, ITimer, IGiftObject } from '..';
import { rxCommands } from '../helpers/rxCommands';
import { rxMe } from '../helpers/rxMe';
import { Commands } from './commands/commands';
import { Timers } from './timers/timers';
import { rxTimers } from '../helpers/rxTimers';
import {
  sendMessageWithConfig,
  sendEventMessageWithConfig
} from '../helpers/sendMessageWithConfig';
import { Timer } from '../helpers/db/db';
import { rxUsers, User } from '../helpers/db/db';
import { Custom_Variables } from './custom_variables/custom_variables';
import {
  accentColor,
  accentHoverColor,
  popupButtonDisabledBackgroundColor
} from '../helpers/appearance';
import { rxLang } from '../helpers/rxLang';
import { Loading } from './generic-styled-components/loading';
import { rxDonations } from '../helpers/rxDonations';
import { rxFollows } from '../helpers/rxFollows';
import { rxGiftedSubs } from '../helpers/rxGiftedSubs';
import { rxSubs } from '../helpers/rxSubs';
import { Tracking } from './tracking/tracking';
import { sendEvent } from '../helpers/reactGA';
import {
  PopupDialog,
  PopupDialogText,
  PopupDialogTitle
} from '../components/generic-styled-components/PopupDialog';

start().catch(null);

/**
 * @description subscribe to all events from dlive and if the payload message is unable to parse
 * then that means the authorization token is invalid
 */
rxEvents.subscribe((event: IRXEvent | undefined) => {
  if (!event || !event.payload || !event.payload.message) {
    return;
  }
  if (
    event.type === 'connection_error' &&
    event.payload.message !== 'invalid json'
  ) {
    updateConfig({ authKey: null }).catch(err => null);
  }
});

const timerIntervals: number[] = [];
let totalMessagesPassed = 0;

// TIMERS ARE RUNNING
rxTimers.subscribe((allTimers: Timer[]) => {
  timerIntervals.forEach(interval => {
    clearInterval(interval);
  });
  allTimers.forEach(timer => {
    let lastSentAt = totalMessagesPassed;
    timerIntervals.push(
      setInterval(() => {
        if (
          lastSentAt <= totalMessagesPassed - timer.messages &&
          timer.enabled
        ) {
          timer.run().catch(null);
          sendEvent('Timers', 'ran').catch(null);
          lastSentAt = totalMessagesPassed;
        }
      }, timer.seconds * 1000)
    );
  });
});

/**
 * @description listen for commands then run them
 */
rxMessages
  .pipe(
    filter(x => {
      if (!x.content) {
        return false;
      }
      totalMessagesPassed += 1;

      return x.content.startsWith('!');
    })
  )
  .pipe(withLatestFrom(rxCommands))
  .subscribe(([message, commands]) => {
    commands.forEach(command => {
      command.checkAndRun(message);
    });
  });

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

/**
 * @description any css that should globally affect all pages should be here
 */
const Global = createGlobalStyle`
  body, #app {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
  * {
    /* transition: all 0.1s ease; */
    &::-webkit-scrollbar {
      background: rgba(0,0,0,0);
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 15px;
    }
    &::-webkit-scrollbar-thumb{
      background: #ccc;
      border-radius: 15px;
    }
  }
  .toggler {
    &.react-toggle--checked .react-toggle-track {
      background-color: ${accentColor} !important ;
    }
    &.react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
      background-color: ${accentHoverColor} !important ;
    } 
    &.react-toggle .react-toggle-track {
      background-color: ${popupButtonDisabledBackgroundColor} ;
    }
    &.react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
      background-color: ${popupButtonDisabledBackgroundColor} ;
    }
    &.react-toggle--focus .react-toggle-thumb {
      -webkit-box-shadow:none;
      -moz-box-shadow: none;
      box-shadow: none;
    }

    &.react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }

    &.react-toggle--checked .react-toggle-thumb {
      border-color: ${accentColor};
    }
  }
  [class*='-menu'] {
    color: ${dropDownBoxColor}  !important;
    background-color: ${dropDownBoxBackgroundColor} !important;
    [class*='-option'] {
      background-color: ${dropDownBoxBackgroundColor} !important;
      
        &:hover, &:active {
            background: ${dropDownBoxHoverColor} !important;
        }
    }
  }
  [class*='-control'] {
    min-height: 33px;
    border-color: ${dropDownBoxBorderColor} !important;
    box-shadow: none !important;
    &:hover, &:active {
      box-shadow: 0px 0px 3px ${dropDownBoxBorderColor} !important;
      cursor: pointer;
    }
    
  }
`;

/**
 * @description Main renderer
 */
export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<Partial<IConfig>>({});
  const [users, setUsers] = useState<{ [id: string]: User }>({});
  const [wordMapLoaded, setWordMapLoaded] = useState(false);
  const [donations, setDonations] = useState<IGiftObject[]>([]);
  const [soundIsRunning, setSoundIsRunning] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  const giftType = (message: IGiftObject) => {
    if (message.gift === 'LEMON') {
      return 'lemon';
    } else if (message.gift === 'ICE_CREAM') {
      return 'ice cream';
    } else if (message.gift === 'DIAMOND') {
      return 'diamond!';
    } else if (message.gift === 'NINJAGHINI') {
      return 'ninjaghini!';
    } else if (message.gift === 'NINJET') {
      return 'ninjet!';
    }
  };

  const sayMsg = (val: string) => {
    if (soundIsRunning) {
      setTimeout(() => {
        sayMsg(val);
      }, 1000);
    }
    setSoundIsRunning(true);
    let utter: SpeechSynthesisUtterance | null = new SpeechSynthesisUtterance();
    utter.text = val;
    utter.volume =
      (typeof config.tts_Amplitude === 'number' ? config.tts_Amplitude : 100) /
      100;
    utter.pitch =
      (typeof config.tts_Pitch === 'number' ? config.tts_Pitch : 100) / 100;
    utter.rate =
      (typeof config.tts_Speed === 'number' ? config.tts_Speed : 100) / 100;
    utter.onend = () => {
      setSoundIsRunning(false);
      utter = null;
    };
    setTimeout(() => {
      if (!utter) {
        return;
      }
      speechSynthesis.speak(utter);
    }, 1500);
  };

  const inLino = (gift: IGiftObject['gift'], amount: string) => {
    let multiplier = 9.01e2;
    switch (gift) {
      case 'ICE_CREAM':
        multiplier = 9.01e3;
        break;
      case 'DIAMOND':
        multiplier = 9.01e4;
        break;
      case 'NINJAGHINI':
        multiplier = 9.01e5;
        break;
      case 'NINJET':
        multiplier = 9.01e6;
        break;
      default:
        multiplier = 9.01e2;
        break;
    }
    return parseInt(amount) * multiplier;
  };

  const newSound = (message: IGiftObject) => {
    if (soundIsRunning) {
      setTimeout(() => {
        newSound(message);
      }, 1000);
    } else if (message.message ? message.message.length > 0 : false) {
      sayMsg(
        `${message.sender.displayname} just donated ${
          message.amount
        } ${giftType(message)} ${message.message ? message.message : ''}`
      );
    } else {
      sayMsg(
        `${message.sender.displayname} just donated ${
          message.amount
        } ${giftType(message)}!`
      );
    }
  };

  // useEffect(() => {
  //   sayMsg('oof');
  // }, []);

  useEffect(() => {
    const listener = rxUsers.pipe(filter(x => !!x)).subscribe(mUsers => {
      setUsers(mUsers);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const listener = rxDonations
      .pipe(
        skip(1),
        filter(x => !!x)
      )
      // tslint:disable-next-line: cyclomatic-complexity
      .subscribe(donation => {
        if (!donation) {
          return;
        }

        if (!users[donation.sender.username]) {
          users[donation.sender.username] = new User(
            donation.sender.username,
            donation.sender.displayname,
            donation.sender.username,
            donation.sender.avatar,
            0,
            0,
            0,
            donation.role,
            donation.roomRole,
            false
          );
        }

        const sender = users[donation.sender.username];

        if (!!sender) {
          sender
            .setLino(
              sender.getLino() + inLino(donation.gift, donation.amount) / 1000
            )
            .catch(null);
          // Check the config to see what they should get for points
          const settings = {
            lemons: 1,
            icecream: 10,
            diamond: 100,
            ninja: 1000,
            ninjet: 10000,
            ...config.donationSettings
          };

          if (donation.gift === 'LEMON') {
            sender.addPoints(settings.lemons).catch(null);
          }
          if (donation.gift === 'ICE_CREAM') {
            sender.addPoints(settings.icecream).catch(null);
          }
          if (donation.gift === 'DIAMOND') {
            sender.addPoints(settings.diamond).catch(null);
          }
          if (donation.gift === 'NINJAGHINI') {
            sender.addPoints(settings.ninja).catch(null);
          }
          if (donation.gift === 'NINJET') {
            sender.addPoints(settings.ninjet).catch(null);
          }

          if (config.eventConfig?.enableEventMessages) {
            if (donation.gift === 'LEMON') {
              sendEventMessageWithConfig(
                !!config.eventConfig?.onLemon
                  ? config.eventConfig?.onLemon
                  : '',
                donation.gift,
                sender
              );
            }
            if (donation.gift === 'ICE_CREAM') {
              sendEventMessageWithConfig(
                !!config.eventConfig?.onIcecream
                  ? config.eventConfig?.onIcecream
                  : '',
                donation.gift,
                sender
              );
            }
            if (donation.gift === 'DIAMOND') {
              sendEventMessageWithConfig(
                !!config.eventConfig?.onDiamond
                  ? config.eventConfig?.onDiamond
                  : '',
                donation.gift,
                sender
              );
            }
            if (donation.gift === 'NINJAGHINI') {
              sendEventMessageWithConfig(
                !!config.eventConfig?.onNinja
                  ? config.eventConfig?.onNinja
                  : '',
                donation.gift,
                sender
              );
            }
            if (donation.gift === 'NINJET') {
              sendEventMessageWithConfig(
                !!config.eventConfig?.onNinjet
                  ? config.eventConfig?.onNinjet
                  : '',
                donation.gift,
                sender
              );
            }
          }
        }

        // say dono here
        // Check to see if the streamer wants this sound played
        if (config.hasTTSDonations) {
          if (config.allowedTTSDonations) {
            if (
              config.allowedTTSDonations
                .map(item => item.value)
                .includes(donation.gift)
            ) {
              newSound(donation);
            }
          } else {
            newSound(donation);
          }
        }
      });

    return () => {
      listener.unsubscribe();
    };
  }, [config, soundIsRunning]);

  useEffect(() => {
    const listener = rxFollows
      .pipe(
        skip(1),
        filter(x => !!x)
      )
      .subscribe(follow => {
        if (!follow) {
          return;
        }
        const sender = users[follow.sender.username];

        if (config.eventConfig?.enableEventMessages) {
          sendEventMessageWithConfig(
            !!config.eventConfig?.onFollow ? config.eventConfig?.onFollow : '',
            'FOLLOW',
            sender
          );
        }
      });

    return () => {
      listener.unsubscribe();
    };
  }, [config]);

  useEffect(() => {
    const listener = rxGiftedSubs
      .pipe(
        skip(1),
        filter(x => !!x)
      )
      .subscribe(giftedSub => {
        if (!giftedSub) {
          return;
        }
        const sender = users[giftedSub.sender.username];

        if (config.eventConfig?.enableEventMessages) {
          sendEventMessageWithConfig(
            !!config.eventConfig?.onFollow ? config.eventConfig?.onFollow : '',
            'GIFTEDSUB',
            sender
          );
        }
      });

    return () => {
      listener.unsubscribe();
    };
  }, [config]);

  useEffect(() => {
    const listener = rxSubs
      .pipe(
        skip(1),
        filter(x => !!x)
      )
      .subscribe(giftedSub => {
        if (!giftedSub) {
          return;
        }
        const sender = users[giftedSub.sender.username];

        if (config.eventConfig?.enableEventMessages) {
          sendEventMessageWithConfig(
            !!config.eventConfig?.onFollow ? config.eventConfig?.onFollow : '',
            'SUB',
            sender
          );
        }
      });

    return () => {
      listener.unsubscribe();
    };
  }, [config]);

  useEffect(() => {
    let listener = setTimeout(() => {
      if (!wordMapLoaded) {
        window.location.reload();
      }
    }, 50000);

    return () => {
      clearTimeout(listener);
    };
  }, [wordMapLoaded]);

  useEffect(() => {
    const listen2 = rxWordMap
      .pipe(
        filter(x => (!!x ? Object.keys(x).length > 0 : false)),
        first()
      )
      .subscribe(map => {
        setWordMapLoaded(true);
      });

    return () => {
      listen2.unsubscribe();
    };
  }, []);
  /**
   * @description this subscriber listens to see if the user logs in through dlive at all
   */
  useEffect(() => {
    const listener = rxEventsFromMain
      .pipe(
        filter(x => x.name === 'newAuthKey' || x.name === 'newAuthKeyStreamer')
      )
      .subscribe((event: IEvent) => {
        if (typeof event.data === 'string') {
          return;
        }
        updateConfig(
          event.name === 'newAuthKey'
            ? // tslint:disable-next-line: no-unsafe-any
              { authKey: event.data.key }
            : event.name === 'newAuthKeyStreamer'
            ? // tslint:disable-next-line: no-unsafe-any
              { streamerAuthKey: event.data.key }
            : {}
        ).catch(err => null);
      });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  /**
   * @description subscribes to config and makes sure there is an auth key
   */
  useEffect(() => {
    const listener = rxConfig.subscribe((mConfig: IConfig) => {
      setConfig(mConfig);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    /**
     * @description listens to rxChat for any new info
     */
    rxChat.subscribe(chatMessage => {
      if (!chatMessage) {
        return;
      }
    });
  }, []);

  useEffect(() => {
    /**
     * @description Wait till everything that needs to be loaded is done loading
     */
    const promiseArr = [];
    const listener = rxWordMap
      .pipe(
        filter(x => !!x),
        first()
      )
      .toPromise();
    promiseArr.push(listener);
    Promise.all(promiseArr)
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => null);
  }, []);

  useEffect(() => {
    /**
     * @description listen to rxUser (for login events)
     *              once the user is logged in, set the state to say they are logged in
     *              then change the route
     *
     *              skips the first as its the default value and will trigger the login screen
     */
    const listener = rxUser.pipe(skip(1)).subscribe((user: firebase.User) => {
      setIsLoggedIn(!!user);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const renderChat = () => <Chat chat={[]} />;
  const renderUsers = () => <Users />;
  const renderCustomVariables = () => <Custom_Variables />;
  const renderCommands = () => <Commands />;
  const renderThemes = () => <Themes />;
  const renderTimers = () => <Timers />;
  const renderLoginDlive = () => (
    <LoginDlive streamer={!!config ? !config.streamerAuthKey : true} />
  );
  const renderLogin = () => <Login />;

  const Main = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <ThemeContextProvider>
      <Background>
        <Global />
        <TitleBar />
        <Offline>
          <SetIfOffline setWasOffline={setWasOffline} />
          <Center>
            <Main>
              <PopupDialog width={'350px'} minHeight={'300px'}>
                <PopupDialogTitle>Offline</PopupDialogTitle>
                <PopupDialogText>
                  It appears you're offline, please reconnect to the internet.
                </PopupDialogText>
              </PopupDialog>
            </Main>
          </Center>
        </Offline>
        <Online>
          <ReloadIfWasOffline wasOffline={wasOffline} />
          {isLoading || !wordMapLoaded ? (
            <Center>
              <Loading />
            </Center>
          ) : (
            <React.Fragment>
              <HashRouter basename='/'>
                {isLoggedIn && config !== null && !!config ? (
                  (!!config.authKey ? config.authKey : '').length > 0 &&
                  (!!config.streamerAuthKey ? config.streamerAuthKey : '')
                    .length > 0 ? (
                    /**
                     * @description user is logged into firebase & dlive
                     */
                    <React.Fragment>
                      <Menu />
                      <div
                        style={{
                          width: 'calc(100vw - 104px)',
                          height: 'calc(100vh - 70px)',
                          marginLeft: '64px',
                          marginTop: '28px',
                          padding: '20px',
                          position: 'relative'
                        }}
                      >
                        <Route
                          path='/commands'
                          exact={true}
                          render={renderCommands}
                        />
                        <Route
                          path='/custom_variables'
                          exact={true}
                          render={renderCustomVariables}
                        />
                        <Route
                          path='/users'
                          exact={true}
                          render={renderUsers}
                        />
                        <Route
                          path='/timers'
                          exact={true}
                          render={renderTimers}
                        />
                        <Route
                          path='/themes'
                          exact={true}
                          render={renderThemes}
                        />
                        <Route path='/' exact={true} render={renderChat} />
                      </div>
                    </React.Fragment>
                  ) : (
                    /**
                     * @description user is logged into firebase but not dlive
                     */
                    <React.Fragment>
                      <Route path='/' exact={true} render={renderLoginDlive} />
                    </React.Fragment>
                  )
                ) : isLoggedIn === null ? null : (
                  /**
                   * @description user is neither logged into firebase nor dlive
                   */
                  <React.Fragment>
                    <Route path='/' exact={true} render={renderLogin} />
                  </React.Fragment>
                )}
              </HashRouter>
            </React.Fragment>
          )}
        </Online>
      </Background>
    </ThemeContextProvider>
  );
};

interface ISetIfOffline {
  setWasOffline: (bool: boolean) => void;
}

const SetIfOffline = (props: ISetIfOffline) => {
  props.setWasOffline(true);
  return null;
};

interface IReload {
  wasOffline: boolean;
}

const ReloadIfWasOffline = (props: IReload) => {
  if (props.wasOffline) {
    window.location.reload();
  }
  return null;
};
