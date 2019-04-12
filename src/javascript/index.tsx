import * as React from 'react';
import * as ReactDOM from 'react-dom';
const mountPoint = document.getElementById('app');
import {hot} from 'react-hot-loader/root';

const {Main} = require('./components/Main.tsx')

ReactDOM.render(hot(<Main/>), mountPoint);