import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdClose, MdTimer, MdDoNotDisturb, MdCancel } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';
import { Toggle, ToggleType } from '../Generics/Toggle';

import { rxUsers, setRxUsers } from '../../helpers/rxUsers';

import Styles from './Chat.scss';
import { first } from 'rxjs/operators';

interface popup {
    styles: any;
    stateTheme: any;
    text?: string | Function | Element | any;
    Config?: any;
    setupAsNewUser: Function | any;
    setupAsExistingUser: Function | any;
    closeCurrentPopup: Function | any;
    addPopup: any;
}

const SetupOptionsPopup = ({
    styles,
    stateTheme,
    text = '',
    addPopup,
    Config = {},
    setupAsNewUser,
    setupAsExistingUser,
    closeCurrentPopup
  }: popup)  => {

  return (
    <div className={`${styles.popup}`}>
        <h2>Setup Options</h2>
        <div className={`${styles.chatFilterPopup}`}>
            <p>
                Please choose one of the following to proceed foward in setting up your bot for the first time.
            </p>
            <p style={stateTheme.timeStamp}>
                *Existing user will need to provide a zip file that you have Exported using >1.6.0.
            </p>
        </div>
        <div className={styles.buttonstack}>
          <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
              setupAsNewUser();
              closeCurrentPopup();
            }}>
          Setup As New User
          </div>
          <div
          className={styles.submit}
          style={stateTheme.submitButton}
          onClick={() => { 
              setupAsExistingUser();
              closeCurrentPopup();
            }}>
          Setup As Existing User
          </div>
        </div>
    </div>
  );
};

export { SetupOptionsPopup };
