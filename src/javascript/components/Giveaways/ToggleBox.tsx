import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ToggleBox = ({ styles, giveaway, stateTheme, ipcRenderer }) => {
  const isOn = giveaway.enabled;
  return (
    <div
      className={styles.box}
      style={Object.assign({}, stateTheme.base.quaternaryForeground)}
      onClick={() => {
        ipcRenderer.send('togglegiveaway', {
          name: giveaway.name,
          enabled: !giveaway.enabled
        });
      }}
    >
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
