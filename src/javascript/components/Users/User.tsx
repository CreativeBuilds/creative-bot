import * as React from 'react';
import { useState } from 'react';

import {
  Button,
  DestructiveButton,
  ActionButton,
  WidgetButton
} from '../Generics/Button';
import { TextField } from '../Generics/Input';

import { MdModeEdit } from 'react-icons/md';
import { theme } from '../../helpers';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ user, styles, closeCurrentPopup, stateTheme }) => {
  const [points, setPoints] = useState<string>(user.points.toString());

  const saveToDB = points => {
    ipcRenderer.send('editpoints', {
      username: user.blockchainUsername
        ? user.blockchainUsername
        : user.username,
      points
    });
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>
        Edit {user.dliveUsername}
        {user.dliveUsername[user.dliveUsername.length - 1].toLowerCase() === 's'
          ? `'`
          : `'s`}{' '}
        Points
      </h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        <TextField
          text={points}
          placeholderText={'Points'}
          header={
            <div>
              {user.dliveUsername ? user.dliveUsername : user.dliveUsername}
              {(user.dliveUsername ? user.dliveUsername : user.dliveUsername)[
                user.dliveUsername.length - 1
              ].toLowerCase() === 's'
                ? `'`
                : `'s`}
              {' points'}
            </div>
          }
          stateTheme={stateTheme}
          width={'100%'}
          inputStyle={Object.assign(
            {},
            { 'margin-bottom': '10px' },
            stateTheme.base.secondaryBackground
          )}
          onChange={e => {
            setPoints(e.target.value);
          }}
        />
        <Button
          title={'Save'}
          isSubmit={true}
          stateTheme={stateTheme}
          onClick={() => {
            if (isNaN(Number(points))) return;
            saveToDB(Number(points));
            closeCurrentPopup();
          }}
        />
      </div>
    </div>
  );
};

const User = ({
  styles,
  style,
  User,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup
}) => {
  const updateUserPointsPopup = user => {
    addPopup(
      <Popup
        user={user}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
      />
    );
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.cell.normal,
        nth % 2 ? stateTheme.cell.alternate : {},
        style
      )}
    >
      <div className={styles.image_container}>
        {/* TODO add the user avatar when the user chats for the first time! */}
        <img
          src={
            User.avatar
              ? User.avatar
              : 'https://images-sih.prd.dlivecdn.com/fit-in/50x50/filters:quality(90)/avatar/default17.png'
          }
          width={26}
          height={26}
        />
      </div>
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>{User.dliveUsername}</div>
        <div className={styles.points}>
          {User.points}
          <WidgetButton
            icon={<MdModeEdit />}
            stateTheme={stateTheme}
            onClick={() => {
              updateUserPointsPopup(User);
            }}
          />
        </div>
        <div className={styles.points}>
          {User.lino ? Math.floor(User.lino / 10) / 100 : 0}
        </div>
        <div className={styles.spacer} />
        {/* <div className={styles.banned}>
          <BannedBox styles={styles} user={User} stateTheme={stateTheme} />
        </div> */}
        {/* <div className={styles.modded}>
          <ModBox styles={styles} user={User} stateTheme={stateTheme} />
        </div> */}
      </div>
    </div>
  );
};

export { User };
