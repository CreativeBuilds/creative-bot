import * as React from 'react';
import {useState} from 'react';

import {Route} from'./Route';
import {Chat} from '../Chat';

const RouteContext = React.createContext({currentUrl: '/'})

const Router = props => {
    const [url, setUrl] = useState('/');

    return (
        <RouteContext.Provider value={{currentUrl: url, setUrl}}>
            <Route url={url} path={'/'} Component={Chat}/>
        </RouteContext.Provider>
    );
}
export {Router};