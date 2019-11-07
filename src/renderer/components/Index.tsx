import { HashRouter, Route } from 'react-router-dom';
import * as React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useState, useEffect } from 'react';
import { Login } from './login/Login';
import { rxUser } from '../helpers/rxUser';
import { Background } from './Background';
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
import { Chat } from './chat/Chat';
import { LoginDlive } from './logindlive/LoginDlive';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { rxEventsFromMain } from '../helpers/eventHandler';

import ThemeProvider, { ThemeContextProvider } from './ThemeContext';

import { rxWordMap } from '../helpers/rxWordMap';
import { rxEvents } from '../helpers/rxEvents';
import { rxConfig, updateConfig } from '../helpers/rxConfig';
import { rxChat, rxMessages } from '../helpers/rxChat';
import { Users } from './users/Users';
import { Themes } from './themes/Themes';
import { start } from '../helpers/start';
import { IRXEvent, IConfig, IEvent, ITimer } from '..';
import { rxCommands } from '../helpers/rxCommands';
import { rxMe } from '../helpers/rxMe';
import { Commands } from './commands/Commands';
import { Timers } from './timers/Timers';
import { rxTimers } from '../helpers/rxTimers';
import { sendMessageWithConfig } from '../helpers/sendMessageWithConfig';
import { Timer } from '../helpers/db/db';
import { Custom_Variables } from './custom_variables/Custom_variables';
import {
  accentColor,
  accentHoverColor,
  popupButtonDisabledBackgroundColor
} from '../helpers/appearance';
import { rxLang } from '../helpers/rxLang';
import { Loading } from './generic-styled-components/Loading';

start().catch(null);

rxMe.subscribe(me => console.log('me', me));

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
`;

/**
 * @description Main renderer
 */
export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<Partial<IConfig>>({});
  const [wordMapLoaded, setWordMapLoaded] = useState(false);

  useEffect(() => {
    let listener = setTimeout(() => {
      if (!wordMapLoaded) {
        window.location.reload();
      }
    }, 5000);

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

  return (
    <ThemeContextProvider>
      <Background>
        <Global />
        <TitleBar />
        {isLoading || !wordMapLoaded ? (
          <Center>
            {console.log(isLoading, wordMapLoaded)}
            <Loading />
          </Center>
        ) : (
          <HashRouter basename='/'>
            {isLoggedIn && (config !== null && !!config) ? (
              (!!config.authKey ? config.authKey : '').length > 0 &&
              (!!config.streamerAuthKey ? config.streamerAuthKey : '').length >
                0 ? (
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
                    <Route path='/users' exact={true} render={renderUsers} />
                    <Route path='/timers' exact={true} render={renderTimers} />
                    <Route path='/themes' exact={true} render={renderThemes} />
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
        )}
      </Background>
    </ThemeContextProvider>
  );
};
