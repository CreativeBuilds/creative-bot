import * as React from 'react';
import { checkPropTypes } from 'prop-types';

const Route = ({url, path, exact = false, children}) => {
    return (url === path && exact) || (!exact && url.includes(path)) ? children : null
}

export {Route};