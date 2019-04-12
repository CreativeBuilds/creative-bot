import * as React from 'react';
import { useState, useContext } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';
import { ThemeContext } from '../../helpers';

import {Li} from './li';

const styles: any = require('./Menu.scss');

const Menu = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  console.log("STATETHEME", stateTheme.menu.title_hover);
  return (
    <React.Fragment>
      <div
        style={stateTheme.menu}
        className={`${styles.menu_popout} ${isOpen ? styles.menu_toggled : ''}`}
      >
        <MdClose
          onClick={() => {
            setIsOpen(false);
          }}
        />
        <ul>
            <Li style={stateTheme.menu.title}>MENU</Li>
            <Li style={{}} hoverStyle={stateTheme.menu.title_hover}>CHAT</Li>
            <Li style={{}} hoverStyle={stateTheme.menu.title_hover}>POINTS</Li>
        </ul>
      </div>
      <div
        className={styles.hamburger}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <MdMenu />
        
      </div>
    </React.Fragment>
  );
};

Menu.contextType = ThemeContext;

export { Menu };
