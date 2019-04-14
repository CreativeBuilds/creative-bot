import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ToggleBox = ({ styles, command, stateTheme }) => {
  const [isOn, setIsOn] = useState<boolean>(command.enabled ? true : false);
  const onClick = () => {
    setIsOn(!isOn);
  };
  return (
    <div className={styles.box} style={Object.assign({}, stateTheme.main)}>
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ToggleBox };
