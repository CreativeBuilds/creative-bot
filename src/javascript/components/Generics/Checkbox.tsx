import * as React from 'react';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';

const Checkbox = ({ isOn, stateTheme, onClick = null }) => {
  const [ison, setIsOn] = useState<boolean>(isOn);
  const onClickEvent = () => {
    setIsOn(!ison);
    onClick(!ison);
  };
  return (
    <div style={Object.assign({}, stateTheme.base.quinaryForeground, stateTheme.checkbox)} onClick={() => { onClickEvent(); }}>
      {ison ? <MdCheck style={stateTheme.checkbox.tick}/> : null}
    </div>
  );
};

export { Checkbox };