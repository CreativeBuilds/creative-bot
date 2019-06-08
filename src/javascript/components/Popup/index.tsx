import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { MdClose } from 'react-icons/md';
import { theme } from '../../helpers';

const { ipcRenderer, shell, remote } = require('electron');
const styles: any = require('./Popup.scss');

const Popup = ({ Component, hasGradiant = false, closePopup }) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [config, setConfig] = useState<any>(null);

  const changeTheme = (themeVal : String) => {
    if (themeVal == 'dark') {
      setStateTheme(theme.dark); 
    } else if (themeVal == 'light') {
      setStateTheme(theme.light);
    }
  }

  useEffect(() => {

    rxConfig.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      changeTheme(data.themeType);
    });
    
  }, []);

  ipcRenderer.once('change-theme', function(event, args) { 
    var value = args as string
    changeTheme(value);
  });

  return (
    <div className={`${styles.overlay}  ${styles.animated}`}>
      <div className={`${styles.dialog} ${hasGradiant ? styles.startupBackground : ''}`} style={hasGradiant ? theme.dark : stateTheme.base.quaternaryBackground}>
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
