import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ToggleBox = ({ styles, list, stateTheme, ipcRenderer }) => {
  const isOn = list.enabled;
  return (
    <div
      className={styles.box}
      style={Object.assign({}, stateTheme.main)}
      onClick={() => {
        ipcRenderer.send('togglelist', {
          name: list.name,
          enabled: !list.enabled
        });
      }}
    >
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
