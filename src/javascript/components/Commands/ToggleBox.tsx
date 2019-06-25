import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { firebaseCommands$, setRxCommands } from '../../helpers/rxCommands';
import { first } from 'rxjs/operators';

const ToggleBox = ({ styles, command, stateTheme, ipcRenderer }) => {
  const isOn = command.enabled;
  return (
    <div
      className={styles.box}
      style={Object.assign({}, stateTheme.base.quinaryForeground)}
      onClick={() => {
        firebaseCommands$.pipe(first()).subscribe(commands => {
          let newCommands = Object.assign({}, commands);
          Object.keys(newCommands).forEach(key => {
            if (key === command.name) {
              newCommands[key] = Object.assign({}, newCommands[key], {
                enabled: !newCommands[key].enabled
              });
            }
          });
          setRxCommands(newCommands);
        });
      }}
    >
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
