import * as React from 'react';
import { useState } from 'react';

import { Route } from './Route';
import { Chat } from '../Chat';
import { Points } from '../Points';
import { Menu } from '../Menu';

const RouteContext = React.createContext({ currentUrl: '/' });

const Router = props => {
  const [url, setUrl] = useState('/');

  return (
    <RouteContext.Provider value={{ currentUrl: url, setUrl }}>
      <Menu setUrl={setUrl}/>
      <div id='content'>
        <Route url={url} path={'/'} Component={Chat} exact={true} />
        <Route url={url} path={'/points'} Component={Points} />
      </div>
    </RouteContext.Provider>
  );
};
export { Router };
