import * as React from 'react';
import { useState, useContext } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';
import { ThemeContext, theme } from '../../helpers';

import { Li } from './li';

const styles: any = require('./Menu.scss');

const Menu = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const { setUrl } = props;
  return (
    <React.Fragment>
      <div
        style={Object.assign(
          {},
          stateTheme.base.tertiaryBackground,
          stateTheme.base.quinaryForeground
        )}
        className={`${styles.menu_popout} ${isOpen ? styles.menu_toggled : ''}`}
      >
        <MdClose
          onClick={() => {
            setIsOpen(false);
          }}
        />
        <ul>
          <Li
            style={Object.assign(
              {},
              stateTheme.toolBar,
              stateTheme.base.quaternaryForeground
            )}
          >
            MENU
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/');
              setIsOpen(false);
            }}
          >
            CHAT
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/users');
              setIsOpen(false);
            }}
          >
            USERS
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/giveaways');
              setIsOpen(false);
            }}
          >
            GIVEAWAYS
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/commands');
              setIsOpen(false);
            }}
          >
            COMMANDS
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/timers');
              setIsOpen(false);
            }}
          >
            TIMERS
          </Li>
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/quotes');
              setIsOpen(false);
            }}
          >
            QUOTES
          </Li>
          {/* { <Li
            style={{}}
            hoverStyle={Object.assign({}, stateTheme.base.secondaryBackground, theme.globals.accentForeground)}
            onClick={() => {
              setUrl('/lists');
              setIsOpen(false);
            }}
          >
            LISTS
          </Li>} */}
          <Li
            style={{}}
            hoverStyle={Object.assign(
              {},
              stateTheme.base.secondaryBackground,
              theme.globals.accentForeground
            )}
            onClick={() => {
              setUrl('/settings');
              setIsOpen(false);
            }}
          >
            SETTINGS
          </Li>
        </ul>
      </div>
      <div
        className={styles.hamburger}
        style={stateTheme.base.quinaryForeground}
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
