import { HashRouter, Route } from 'react-router-dom';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Login } from './login/Login';
import { rxUser } from '../helpers/rxUser';
import { Background } from './Background';
import { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
  body, #app {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
`;

/**
 * @description Main renderer
 */
export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    /**
     * @description listen to rxUser (for login events)
     *              once the user is logged in, set the state to say they are logged in
     *              then change the route
     */
    const listener = rxUser.subscribe((user: firebase.User) => {
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
          <div>Logged in!</div>
        ) : (
          <React.Fragment>
            {/* <Route path='123' render={() => <div />} /> */}
            <Route path='/' exact={true} render={() => <Login />} />
          </React.Fragment>
        )}
      </HashRouter>
    </Background>
  );
};
