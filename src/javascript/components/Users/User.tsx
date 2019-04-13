import * as React from 'react';
import {useState} from 'react';

import { ModBox } from './ModBox';
import { BannedBox } from './BannedBox';

import { MdModeEdit } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ user, styles, closeCurrentPopup }) => {
  console.log(user);
  const [points, setpoints] = useState<number>(user.points);

  const saveToDB = points => {
    ipcRenderer.send("editpoints", {username: user.username, points})
  }

  return (
    <div className={styles.popup}>
      <h1>Edit {user.displayname}'s Points</h1>
      <input className={styles.input} type='number' onChange={(e)=>{
        console.log(e.target.value);
        setpoints(parseInt(e.target.value));
      }} value={points} />
      <div className={styles.submit} onClick={() => {saveToDB(points); closeCurrentPopup()}}>SAVE</div>
    </div>
  );
};

const User = ({ styles, User, nth, stateTheme, addPopup, closeCurrentPopup }) => {
  const updateUserPointsPopup = user => {
    addPopup(<Popup user={user} styles={styles} closeCurrentPopup={closeCurrentPopup} />);
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
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
        <div className={styles.username}>{User.displayname}</div>
        <div className={styles.points}>
          {User.points}
          <MdModeEdit
            onClick={() => {
              updateUserPointsPopup(User);
            }}
          />
        </div>
        <div className={styles.points}>
          {User.lino ? Math.floor(User.lino/10)/100 : 0}
        </div>
        <div className={styles.spacer} />
        {/* <div className={styles.banned}>
          <BannedBox styles={styles} user={User} stateTheme={stateTheme} />
        </div> */}
        <div className={styles.modded}>
          <ModBox styles={styles} user={User} stateTheme={stateTheme} />
        </div>
      </div>
    </div>
  );
};

export { User };
