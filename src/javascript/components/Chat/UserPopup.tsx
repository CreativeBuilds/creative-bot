import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdClose, MdTimer, MdDoNotDisturb, MdCancel } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';

import { Toggle, ToggleType } from '../Generics/Toggle';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';
import { TextField, StepperField } from '../Generics/Input';

import { firebaseUsers$, setRxUsers } from '../../helpers/rxUsers';

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
      <div style={stateTheme.popup.dialog.content.fullWidth}>
        <div
          style={stateTheme.chatPage.userPopup.container}>
          <div
            style={stateTheme.chatPage.userPopup.header}>
            <div style={Object.assign({}, 
                  stateTheme.cell.alternate, 
                  stateTheme.chatPage.userPopup.header.panel)}>
              <div
                style ={stateTheme.chatPage.userPopup.username}>
                <div style={stateTheme.chatPage.userPopup.username.title}>
                  {user.dliveUsername}
                </div>
              </div>
              <div
                style={stateTheme.chatPage.userPopup.actions}>
                <div data-tip='Remove Message'>
                  {canDelete ? (
                    <MdCancel
                      style={stateTheme.chatPage.userPopup.actions.item}
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
                      style={stateTheme.chatPage.userPopup.actions.item}
                      onClick={() => {
                        timeoutUser();
                      }}
                    />
                  ) : null}
                </div>
                <div data-tip='Ban User'>
                  <MdDoNotDisturb
                    style={stateTheme.chatPage.userPopup.actions.item}
                    onClick={() => {
                      muteUser();
                    }}
                  />
                </div>

                <ReactTooltip />
              </div>
            </div>
            <div style={stateTheme.chatPage.userPopup.avatar}>
              <img style={stateTheme.chatPage.userPopup.avatar.img} src={user.avatar} />
            </div>
          </div>
          <div style={{ display: 'block', width: '100%'}}>
            <div style={{ display: 'inline-flex', width: '100%', marginBottom: '10px' }}>
              <TextField 
                placeholderText={"Enter Points"} 
                stateTheme={stateTheme} 
                width={'90%'}
                style={{ height: '32px', marginTop: '11px' }}
                inputStyle={stateTheme.base.secondaryBackground}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    setPoints(e.target.value);
                }}/>
              <Toggle
                header='Is Admin'
                type={ToggleType.compact}
                style={{ float: 'right', marginBottom: '0px !important' }}
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
