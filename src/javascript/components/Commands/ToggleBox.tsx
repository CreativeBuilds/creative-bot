import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ToggleBox = ({ styles, command, stateTheme, ipcRenderer }) => {
  const isOn = command.enabled;
  return (
    <div
      className={styles.box}
      style={Object.assign({}, stateTheme.main)}
      onClick={() => {
        ipcRenderer.send('togglecommand', {
          name: command.name,
          enabled: !command.enabled
        });
      }}
    >
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
