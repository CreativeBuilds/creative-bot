import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';

const { User } = require('./User');
const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Users.scss');

const UsersPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('points');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchUsername, setSearchUsername] = useState<string>('');
  const { Users, addPopup, closeCurrentPopup } = props;

  let userArray = _.orderBy(
    _.sortBy(Object.keys(Users))
      .map(username => Users[username])
      .filter(user => {
        if (searchUsername.trim() === '') return true;
        return user.displayname
          .toLowerCase()
          .includes(searchUsername.trim().toLowerCase());
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );

  return (
    <div style={stateTheme.menu} className={styles.Points}>
      <div style={stateTheme.menu.title} className={styles.header}>
        USERS
        <textarea
          className={styles.usersearch}
          style={stateTheme.chat.message.alternate}
          placeholder={'Search...'}
          value={searchUsername}
          onChange={e => {
            setSearchUsername(e.target.value);
          }}
        />
      </div>
      <div style={{}} className={styles.content}>
        {/* TODO ADD PAGINATION */}
        <Sorting
          toggle={toggle}
          setToggle={setToggle}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          styles={styles}
          stateTheme={stateTheme}
        />
        {userArray.map((user, nth) => {
          return (
            <User
              styles={styles}
              User={user}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
            />
          );
        })}
      </div>
    </div>
  );
};

export { UsersPage };
