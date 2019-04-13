import * as React from 'react';
import { useContext, Component } from 'react';
import { ThemeContext } from '../../helpers';
import { any } from 'prop-types';

const { User } = require('./User');
const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Users.scss');

const UsersPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const { Users } = props;
  return (
    <div style={stateTheme.menu} className={styles.Points}>
      <div style={stateTheme.menu.title} className={styles.header}>
        USERS
      </div>
      <div style={{}} className={styles.content}>
        {/* TODO ADD PAGINATION */}
        <Sorting styles={styles} stateTheme={stateTheme} />
        {Object.keys(Users).map((username, nth) => {
          let user = Users[username];
          console.log(user, Users, username);
          return (
            <User
              styles={styles}
              User={user}
              stateTheme={stateTheme}
              nth={nth + 1}
            />
          );
        })}
      </div>
    </div>
  );
};

export { UsersPage };
