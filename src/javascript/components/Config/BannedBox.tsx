import * as React from 'react';
import { useState } from 'react';
import {MdCheck} from 'react-icons/md';

const BannedBox = ({ styles, user, stateTheme }) => {
  const [isOn, setIsOn] = useState<boolean>(
    user.role === 'Owner' || user.role === 'Moderator' ? true : false
  );
  return <div className={styles.box} style={Object.assign({}, stateTheme.main)} onClick={() => {
      setIsOn(!isOn);
  }}>
    {isOn? <MdCheck/> : null}
  </div>;
};

export { BannedBox };
