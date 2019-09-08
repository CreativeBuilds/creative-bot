import { HashRouter, Route } from 'react-router-dom';
import * as React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useState, useEffect } from 'react';
import { Login } from './login/Login';
import { rxUser } from '../helpers/rxUser';
import { Background } from './Background';
import { createGlobalStyle } from 'styled-components';
import { filter, skip, first } from 'rxjs/operators';
import { Menu } from './menu/Menu';
import { Chat } from './chat/Chat';
import { LoginDlive } from './logindlive/LoginDlive';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { sendToMain, rxEventsFromMain } from '../helpers/eventHandler';

import { rxWordMap } from '../helpers/rxWordMap';
import { rxEvents } from '../helpers/rxEvents';
import { rxConfig, updateConfig } from '../helpers/rxConfig';
import { rxChat } from '../helpers/rxChat';

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
`;

/**
 * @description Main renderer
 */
export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<Partial<IConfig> | null>(null);
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
      console.log(chatMessage);
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
  const renderLoginDlive = () => (
    <LoginDlive streamer={!!config ? !config.streamerAuthKey : true} />
  );
  const renderLogin = () => <Login />;

  return (
    <Background>
      <Global />
      {isLoading ? null : (
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
                    height: 'calc(100vh - 40px)',
                    marginLeft: '64px',
                    padding: '20px',
                    position: 'relative'
                  }}
                >
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
  );
};
