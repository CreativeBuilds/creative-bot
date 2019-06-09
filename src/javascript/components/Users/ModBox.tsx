import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const ModBox = ({ styles, user, stateTheme }) => {
  const [isOn, setIsOn] = useState<boolean>(
    user.role === 'Owner' || user.role === 'Moderator' ? true : false
  );
  const onClick = () => {
    setIsOn(!isOn);
  };
  return (
    <div className={styles.box} style={Object.assign({}, stateTheme.base.quinaryForeground)}>
      {isOn ? <MdCheck /> : null}
    </div>
  );
};

export { ModBox };
