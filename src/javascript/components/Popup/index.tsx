import * as React from 'react';
import { MdClose } from 'react-icons/md';
const { useState } = React;
import { theme } from '../../helpers';

const styles: any = require('./Popup.scss');

const Popup = ({ Component, closePopup }) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} style={stateTheme.main}>
        <div className={styles.close}>
          <MdClose
            onClick={() => {
              closePopup();
            }}
          />
        </div>
        {Component}
      </div>
    </div>
  );
};

export { Popup };
