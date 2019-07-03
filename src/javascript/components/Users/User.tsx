import * as React from 'react';
import { useState } from 'react';

import { ModBox } from './ModBox';

import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

import { MdModeEdit } from 'react-icons/md';
import { theme } from '../../helpers';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ user, styles, closeCurrentPopup, stateTheme }) => {
  const [points, setPoints] = useState<string>(user.points.toString());

  const saveToDB = points => {
    ipcRenderer.send('editpoints', {
      username: user.blockchainUsername,
      points
    });
  };

  return (
    <div className={styles.popup}>
      {/* <h1>
        Edit {user.dliveUsername}
        {user.dliveUsername[user.dliveUsername.length - 1].toLowerCase() === 's'
          ? `'`
          : `'s`}{' '}
        Points
      </h1> */}
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>
          {user.dliveUsername ? user.dliveUsername : user.dliveUsername}
          {(user.dliveUsername ? user.dliveUsername : user.dliveUsername)[
            user.dliveUsername.length - 1
          ].toLowerCase() === 's'
            ? `'`
            : `'s`}
          {' points'}
        </div>
        <textarea
          className={styles.input}
          onChange={e => {
            setPoints(e.target.value);
          }}
          value={points}
        />
      </div>
      <Button 
        title={"Save"} 
        isSubmit={true} 
        stateTheme={stateTheme}  
        onClick={() => {
            if (isNaN(Number(points))) return;
            saveToDB(Number(points));
            closeCurrentPopup();
          }} />
    </div>
  );
};

const User = ({
  styles,
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
        nth % 2 ? stateTheme.cell.alternate : { }
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
          <MdModeEdit
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
