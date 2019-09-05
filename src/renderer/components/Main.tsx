import { HashRouter, Route } from 'react-router-dom';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Login } from './login/Login';
import { rxUser } from '../helpers/rxUser';
import { Background } from './Background';
import { createGlobalStyle } from 'styled-components';
import { filter, skip } from 'rxjs/operators';
import { Menu } from './menu/Menu';
import { Chat } from './chat/Chat';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const Global = createGlobalStyle`
  body, #app {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
  #menu-toggle{
    & > span {
      background: #922cce !important;
    }
    &:hover > span {
      background: #ad44eb !important;
    }
  }
`;

/**
 * @description Main renderer
 */
export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

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

  return (
    <Background>
      <Global />
      <HashRouter basename='/'>
        {isLoggedIn ? (
          <React.Fragment>
            <Menu />
            <div
              style={{
                width: 'calc(100vw - 84px)',
                height: 'calc(100vh - 20px)',
                marginLeft: '64px',
                padding: '10px',
                position: 'relative'
              }}
            >
              <Route path='/' exact={true} render={() => <Chat />} />
            </div>
          </React.Fragment>
        ) : isLoggedIn === null ? null : (
          <React.Fragment>
            <Route path='/' exact={true} render={() => <Login />} />
          </React.Fragment>
        )}
      </HashRouter>
    </Background>
  );
};
