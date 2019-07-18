import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdClose, MdTimer, MdDoNotDisturb, MdCancel } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';

import { Toggle, ToggleType } from '../Generics/Toggle';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';
import { TextField, StepperField } from '../Generics/Input';

import { firebaseUsers$, setRxUsers } from '../../helpers/rxUsers';

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
    let listener = firebaseUsers$.pipe().subscribe(users => {
      if (first) {
        first = false;
        let User = users[user.blockchainUsername];
        if (!User) return (first = true);
        setUser(User);
        setPoints(User.points);
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
    if (Object.keys(Users[user.blockchainUsername]).length <= 2)
      return setSubmitText('ERROR USER NOT IN DB');
    setRxUsers(Users);
    setSubmitText('SAVED');
    setTimeout(() => {
      setSubmitText('SUBMIT');
    }, 1500);
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <div style={Object.assign({}, {
          'min-height': 'min-content',
          height: '300px',
          'max-height': '90vh',
        }, stateTheme.popup.dialog.content.fullWidth)}>
        <div
          style={{
            width: '100%',
            height: 'min-content'
          }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '192.5px',
              position: 'relative'
            }}>
            <div style={Object.assign({}, 
                stateTheme.cell.alternate, {
                  width: '100%',
                  height: '125px',
                  'border-radius': '5px',
                  display: 'flex',
                  'justify-content': 'center'
                })}>
              <div className={Styles.username} 
                style ={{
                  display: 'flex',
                  'justifyContent': 'center',
                  width: '70%',
                  height: 'calc(100% - 67.5px)',
                  'alignItems': 'center',
                  'letterSpacing': '1px',
                }}>
                <div 
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    'textOverflow': 'ellipsis',
                    'whiteSpace': 'nowrap',
                    'fontSize': '1.6em',
                    'fontWeight': 'bold',
                    'textAlign': 'center',
                  }}>
                  {user.dliveUsername}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '72.5px',
                  right: '5px',
                  width: 'min-content',
                  height: 'min-content',
                  display: 'flex',
                  'fontSize': '1.6em',
                }}>
                <div data-tip='Remove Message'>
                  {canDelete ? (
                    <MdCancel
                      style={{ 'marginLeft': '10px' }}
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
                      style={{ 'marginLeft': '10px' }}
                      onClick={() => {
                        timeoutUser();
                      }}
                    />
                  ) : null}
                </div>
                <div data-tip='Ban User'>
                  <MdDoNotDisturb
                    style={{ 'marginLeft': '10px' }}
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
              <TextField 
                placeholderText={"Enter Points"} 
                stateTheme={stateTheme} 
                width={'50%'}
                inputStyle={stateTheme.base.secondaryBackground}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    setPoints(e.target.value);
                }}/>
              <Toggle
                header='Is Admin'
                type={ToggleType.compact}
                isEnabled={true}
                isOn={isAdmin}
                onClick={() => {
                  setIsAdmin(!isAdmin);
                }}
                stateTheme={stateTheme}
              />
            </div>
            <Button title={submitText} isSubmit={true} stateTheme={stateTheme} onClick={() => {
              SaveUser();
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserPopup };
