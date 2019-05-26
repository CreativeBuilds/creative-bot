import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdClose, MdTimer, MdDoNotDisturb, MdCancel } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';

import { rxUsers, setRxUsers } from '../../helpers/rxUsers';

import Styles from './Chat.scss';
import { first } from 'rxjs/operators';

const UserPopup = ({
  closeCurrentPopup,
  user,
  stateTheme,
  canDelete,
  deleteMessage,
  timeoutUser,
  muteUser
}) => {
  const [points, setPoints] = useState('0');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState({});
  const [User, setUser] = useState({});

  const [submitText, setSubmitText] = useState('SUBMIT');

  useEffect(() => {
    let first = true;
    // Needs to fire a thing to the ipcMain and then listen for a response
    let listener = rxUsers.pipe().subscribe(users => {
      if (first) {
        first = false;
        let User = users[user.blockchainUsername];
        setUser(User);
        setPoints(User.points);
        console.log(User);
        setIsAdmin(!!User.isAdmin);
      }
      setUsers(users);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  let SaveUser = () => {
    let Users = Object.assign({}, users);
    Users[user.blockchainUsername] = Object.assign(
      {},
      Users[user.blockchainUsername],
      { isAdmin, points: Number(points) }
    );
    setRxUsers(Users);
    setSubmitText('SAVED');
    setTimeout(() => {
      setSubmitText('SUBMIT');
    }, 1500);
  };

  return (
    <div className={Styles.UserPopup}>
      <div className={Styles.UserPopup_header}>
        <div className={Styles.UserPopup_header_up}>
          <div style={stateTheme.chat.message.alternate}>
            <div className={Styles.username}>
              <div>{user.dliveUsername}</div>
            </div>
            <div className={Styles.UserPopup_header_up_right}>
              <div data-tip='Remove Message'>
                {canDelete ? (
                  <MdCancel
                    onClick={() => {
                      deleteMessage();
                      closeCurrentPopup();
                    }}
                  />
                ) : null}
              </div>
              <div data-tip='Timeout for 5 Minutes'>
                {canDelete ? (
                  <MdTimer
                    onClick={() => {
                      timeoutUser();
                    }}
                  />
                ) : null}
              </div>
              <div data-tip='Ban User'>
                <MdDoNotDisturb
                  onClick={() => {
                    muteUser();
                  }}
                />
              </div>

              <ReactTooltip />
            </div>
          </div>
          <div style={stateTheme.main}>
            <img src={user.avatar} />
          </div>
        </div>
        <div className={Styles.UserPopup_header_down}>
          <div className={Styles.input_wrapper}>
            <div className={Styles.input_points}>
              <div>Points</div>
              <input
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    setPoints(e.target.value);
                }}
                style={stateTheme.menu}
                value={points}
              />
            </div>
            <div className={Styles.input_is_admin}>
              <div>Is Admin</div>
              <div
                style={stateTheme.menu}
                onClick={() => {
                  setIsAdmin(!isAdmin);
                }}
              >
                <div
                  style={{
                    background: isAdmin
                      ? stateTheme.main.highlightColor
                      : stateTheme.chat.message.alternate.backgroundColor
                  }}
                  className={isAdmin ? Styles.isAdmin : ''}
                />
              </div>
            </div>
          </div>
          <div
            className={Styles.user_submit}
            style={stateTheme.menu}
            onClick={() => {
              SaveUser();
            }}
          >
            {submitText}
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserPopup };
