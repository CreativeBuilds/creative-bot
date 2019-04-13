import * as React from 'react';
import { useState } from 'react';

const Sorting = ({ styles, stateTheme }) => {
  const [toggle, setToggle] = useState<string>('points');

  return (
    <div className={styles.user} style={stateTheme.chat.message}>
      <div className={styles.image_container}>
        <img
          src={
            'https://images-sih.prd.dlivecdn.com/fit-in/50x50/filters:quality(90)/avatar/default17.png'
          }
          width={26}
          height={26}
        />
      </div>
      <div className={styles.toggle_wrappers} >
          <div>USERNAME</div>
          <div>POINTS</div>
          <div className={styles.spacer}></div>
          <div>BANNED</div>
          <div>MOD</div>
      </div>
    </div>
  );
};

export { Sorting };
