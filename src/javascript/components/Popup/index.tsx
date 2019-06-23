import * as React from 'react';
import { useState, useEffect } from 'react';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { MdClose } from 'react-icons/md';
import { theme } from '../../helpers';

const { ipcRenderer, shell, remote } = require('electron');
const styles: any = require('./Popup.scss');

const Popup = ({ Component, hasGradiant = false, closePopup, noX = false }) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [config, setConfig] = useState<any>(null);

  const changeTheme = (themeVal: String) => {
    if (themeVal == 'dark') {
      setStateTheme(theme.dark);
    } else if (themeVal == 'light') {
      setStateTheme(theme.light);
    }
  };

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      changeTheme(data.themeType);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <div className={`${styles.overlay}  ${styles.animated} animated fadeIn`}>
      <div
        className={`${styles.dialog} ${
          hasGradiant ? styles.startupBackground : ''
        } animated fadeInUp`}
        style={hasGradiant ? theme.dark : stateTheme.base.quinaryBackground}
      >
        {noX ? null : (
          <div className={styles.close}>
            <MdClose
              onClick={() => {
                closePopup();
              }}
            />
          </div>
        )}
        {Component}
      </div>
    </div>
  );
};

export { Popup };
