import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';
import { ThemeContext, theme } from '../../helpers';

import { firebase } from '../../helpers/firebase';

import { WidgetButton } from '../Generics/Button';

import { Li } from './li';
import { firebaseConfig$ } from '../../helpers/rxConfig';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const Menu = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<any>({});

  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const { setUrl } = props;

  useEffect(() => {
    let listener = firebaseConfig$.subscribe(setConfig);
    return () => {
      listener.unsubscribe();
    };
  }, []);
  return (
    <React.Fragment>
      <div
        style={Object.assign(
          {},
          Object.assign({},
          stateTheme.base.tertiaryBackground,
          stateTheme.base.quinaryForeground
          ),
          Object.assign({}, 
            isOpen ? stateTheme.menu.toggled : stateTheme.menu.popout, 
            stateTheme.menu
            )
        )}>
        <WidgetButton 
        icon={<MdClose style={stateTheme.button.widget.closeMenu.icon}/>} 
        stateTheme={stateTheme}
        style={stateTheme.button.widget.closeMenu} 
        onClick={() => {
          setIsOpen(false);
        }}/>
        <ul style={stateTheme.menu.ul}>
          <Li
            style={Object.assign(
              {},
              Object.assign({},
              stateTheme.page.header,
              stateTheme.base.quaternaryForeground
              ),
              Object.assign({},
                stateTheme.menu.item.header,
                stateTheme.menu.item
                )
            )}
          >
            MENU
          </Li>
          <Li
            style={stateTheme.menu.item}
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
            style={stateTheme.menu.item}
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
            style={stateTheme.menu.item}
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
            style={stateTheme.menu.item}
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
            style={stateTheme.menu.item}
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
            style={stateTheme.menu.item}
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
          {/* <Li
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
          </Li> */}
          {
            <Li
            style={stateTheme.menu.item}
              hoverStyle={Object.assign(
                {},
                stateTheme.base.secondaryBackground,
                theme.globals.accentForeground
              )}
              onClick={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    ipcRenderer.send('logout');
                    setTimeout(() => {
                      window.close();
                    }, 500);
                  });
              }}
            >
              LOGOUT
            </Li>
          }
        </ul>
      </div>
      <WidgetButton 
        icon={<MdMenu style={stateTheme.button.widget.hamburger.icon}/>} 
        stateTheme={stateTheme} 
        style={stateTheme.button.widget.hamburger}
        onClick={() => {
          setIsOpen(true);
        }}/>
    </React.Fragment>
  );
};

Menu.contextType = ThemeContext;

export { Menu };
