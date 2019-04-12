import * as React from 'react';
import * as ReactDOM from 'react-dom';
const mountPoint = document.getElementById('app');

const {Main} = require('./components/Main.tsx')

ReactDOM.render(<Main/>, mountPoint);