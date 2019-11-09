/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import { Main } from './components/index';

ReactDOM.render(<Main />, document.getElementById('app'));
