import * as React from 'react';
import { MdClose } from 'react-icons/md';
const { useState } = React;
import { theme } from '../../helpers';

const { ipcRenderer, shell, remote } = require('electron');
const styles: any = require('./Popup.scss');

const Popup = ({ Component, closePopup }) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);

  ipcRenderer.once('change-theme', function(event, args) { 
    var value = args[0] as string
    if (value == "dark") {
      setStateTheme(theme.dark);
    } else {
      setStateTheme(theme.light);
    }
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} style={stateTheme.main}>
        <div className={styles.close}>
          <MdClose
            onClick={() => {
              closePopup();
            }}
          />
        </div>
        {Component}
      </div>
    </div>
  );
};

export { Popup };
