import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ToggleBox = ({ styles, timer, stateTheme, ipcRenderer, editTimer }) => {
  const isOn = timer.enabled;
  return (
    <div
      className={styles.box}
      style={Object.assign({}, stateTheme.main)}
      onClick={() => {
        editTimer(timer.name, !timer.enabled);
      }}
    >
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
