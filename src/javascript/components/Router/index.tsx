import * as React from 'react';
import {useState} from 'react';

import {Route} from'./Route';
import {Chat} from '../Chat';

const Router = props => {
    const [url, setUrl] = useState('/');

    return (
        <React.Fragment>
            <Route url={url} path={'/'}>
                <Chat></Chat>
            </Route>
        </React.Fragment>
    );
}
export {Router};