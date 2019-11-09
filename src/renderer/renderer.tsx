/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import { Main } from './components/index';
import { getUsersFromDB } from './helpers/db/db';

ReactDOM.render(<Main />, document.getElementById('app'));
getUsersFromDB()
  .then(console.log)
  .catch(null);
