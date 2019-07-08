import * as React from 'react';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

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
}: popup) => {
  return (
    <div className={`${styles.popup}`}>
      <h2>Setup Options</h2>
      <div className={`${styles.chatFilterPopup}`}>
        <p>
          Please choose one of the following to proceed foward in setting up
          your bot for the first time.
        </p>
        <p style={stateTheme.timeStamp}>
          *Existing user will need to provide a zip file that you have Exported
          using >1.6.0 and is a Beta Feature
        </p>
      </div>
      <div className={styles.buttonstack}>
        <Button title={"Setup As New User"} 
        isSubmit={true} 
        stateTheme={stateTheme}
        buttonStyle={{width: '-webkit-fill-available'}}
        onClick={() => {
          setupAsExistingUser();
          closeCurrentPopup();
        }}/>
        <Button title={"Setup As Existing User"} 
        isSubmit={true} 
        stateTheme={stateTheme} 
        buttonStyle={{width: '-webkit-fill-available',
        'margin-left': '10px'}} 
        onClick={() => {
          setupAsExistingUser();
          closeCurrentPopup();
        }} />
      </div>
    </div>
  );
};

export { SetupOptionsPopup };
