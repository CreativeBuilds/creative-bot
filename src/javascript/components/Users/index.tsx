import * as React from 'react';
import { useContext, Component } from 'react';
import { ThemeContext } from '../../helpers';
import { any } from 'prop-types';

const User = require('./User');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Users.scss');

const UsersPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const { Users } = props;
  return (
    <div style={stateTheme.menu} className={styles.Points}>
      <div style={stateTheme.menu.title} className={styles.header}>
        POINTS
      </div>
      <div style={{}} className={styles.content}>
        {Object.keys(Users).map((username, nth) => {
          let user = Users[username];
          return (
            <User
              styles={styles}
              User={user}
              stateTheme={stateTheme}
              nth={nth}
            />
          );
        })}
      </div>
    </div>
  );
};

export { UsersPage };
