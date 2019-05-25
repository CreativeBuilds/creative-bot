import * as React from 'react';
import { MdClose } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';

import Styles from './Chat.scss';

const UserPopup = ({ closeCurrentPopup, user, stateTheme }) => {
  console.log(user);
  return (
    <div className={Styles.UserPopup}>
      <div className={Styles.UserPopup_header}>
        <div className={Styles.UserPopup_header_left}>
          <div style={stateTheme.chat.message.alternate} />
          <div style={stateTheme.main}>
            <img src={user.avatar} />
          </div>
        </div>
        <div className={Styles.UserPopup_header_right}>
          {user.dliveUsername}
        </div>
      </div>
    </div>
  );
};

export { UserPopup };
