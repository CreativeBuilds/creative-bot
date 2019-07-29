import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';
import { Panel } from '../Generics/Panel';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

interface popup {
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  closeCurrentPopup: Function | any;
}

const AccountsPopup = ({
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [config, setConfig] = useState(Config);
  const [authKey, setAuthKey] = useState(config.authKey || '');

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = tConfig => {
    setRxConfig(tConfig);
  };

  const needRestart = () => {
    return config.authKey !== authKey;
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Account Settings</h2>
      <div style={stateTheme.popup.dialog.content.seventyWidth} >
        {!!config.authKey ? (
          <DestructiveButton 
            title={"Reconnect Bot Account"} 
            stateTheme={stateTheme} 
            onClick={() => {
              let tconfig = Object.assign({}, config);
              delete tconfig.authKey;
              setConfig(tconfig);
              // setTimeout(() => {
              //   closeCurrentPopup();
              // }, 50);
            }} />
        ) : null}
        {!config.ported ? (
          <ActionButton 
            title={"Import Old Users (1.5 and Older)"} 
            stateTheme={stateTheme}  
            onClick={() => {
              ipcRenderer.send('getAllOldData');
              if (needRestart()) {
                saveToDB(config);
                setTimeout(() => {
                  ipcRenderer.send('shutdown');
                }, 250);
              }
              closeCurrentPopup();
            }} />
        ) : null}
        <div style={stateTheme.popup.dialog.buttonStack}>
          <Button 
          title={"Close"} 
          isSubmit={true} 
          buttonStyle={{ width: '100%'}}
          stateTheme={stateTheme}  
          onClick={() => {
              // Check to see if a change has happened
              if (needRestart()) {
                saveToDB(config);
                setTimeout(() => {
                  ipcRenderer.send('shutdown');
                }, 250);
              }
              closeCurrentPopup();
            }} />
        {needRestart() ? (
          <i style={{ marginTop: '5px' }}>Bot will need to be restarted...</i>
        ) : null}
        </div>
      </div>
    </div>
  );
};

export { AccountsPopup };