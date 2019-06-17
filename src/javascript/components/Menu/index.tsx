import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';
import { ThemeContext, theme } from '../../helpers';

import { firebase } from '../../helpers/firebase';

import { Li } from './li';
import { rxConfig } from '../../helpers/rxConfig';

const styles: any = require('./Menu.scss');

const Menu = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<any>({});

  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const { setUrl } = props;

  useEffect(() => {
    let listener = rxConfig.subscribe(setConfig);
    return () => {
      listener.unsubscribe();
    };
  }, []);
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
          {typeof config.isFirebaseUser !== 'undefined' ? (
            <Li
              style={{}}
              hoverStyle={Object.assign(
                {},
                stateTheme.base.secondaryBackground,
                theme.globals.accentForeground
              )}
              onClick={() => {
                firebase.auth().signOut();
                setIsOpen(false);
                window.location.reload();
              }}
            >
              LOGOUT
            </Li>
          ) : null}
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
