import * as React from 'react';
import * as data from './theme.json';

/*const theme = (id: string): any => {
    const obj = Object.assign({},data.appearances);
    return obj[id];
}*/

const ThemeContext = React.createContext({ appearance: data.appearances.light });
const themeData = data;

export { ThemeContext, themeData }