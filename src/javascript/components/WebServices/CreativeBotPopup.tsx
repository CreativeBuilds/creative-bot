import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./WebServices.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
  styles: any;
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  closeCurrentPopup: Function | any;
  Emotes?: {};
}

const CreativeBotPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [name, setName] = useState<string>('');
  const [helperText, SetHelperText] = useState(text);
  const [error, SetError] = useState(false);
  const [config, setConfig] = useState(Config);

  return (
    <div className={`${styles.popup}`} style={theme.dark}>
      <h2>Welcome to CreativeBot</h2>
      <div className={`${styles.creativeBotPopup}`}>
        This is a Test Popup for when CreativeBot Online becomes avaliable to
        everyone, and this one of the ways for the app to promote the service
      </div>
      <div className={styles.buttonstack}>
        <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => {}}
        >
          Continue Offline Mode
        </div>
        <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => {}}
        >
          Learn More
        </div>
      </div>
    </div>
  );
};

export { CreativeBotPopup };
