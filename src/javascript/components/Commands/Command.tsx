import * as React from 'react';
import { useState } from 'react';

import { ToggleBox } from './ToggleBox';

import { MdModeEdit } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ user, styles, closeCurrentPopup, stateTheme }) => {
  const [points, setpoints] = useState<string>(user.points.toString());

  const saveToDB = points => {
    ipcRenderer.send('editpoints', { username: user.username, points });
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <h1>
        Edit {user.displayname}
        {user.displayname[user.displayname.length - 1].toLowerCase() === 's'
          ? `'`
          : `'s`}{' '}
        Points
      </h1>
      <textarea
        className={styles.input}
        onChange={e => {
          setpoints(e.target.value);
        }}
        value={points}
      />
      <div
        className={styles.submit}
        onClick={() => {
          if (isNaN(Number(points))) return;
          saveToDB(Number(points));
          closeCurrentPopup();
        }}
      >
        SAVE
      </div>
    </div>
  );
};

const Command = ({
  styles,
  command,
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
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>{command.name}</div>
        <div className={styles.points}>{command.uses}</div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          <ToggleBox
            styles={styles}
            command={command}
            stateTheme={stateTheme}
          />
        </div>
      </div>
    </div>
  );
};

export { Command };
