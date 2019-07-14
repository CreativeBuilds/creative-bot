import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext, MenuItems } from '../../helpers';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import {
  MdClose,
  MdCheckBoxOutlineBlank,
  MdFlipToFront,
  MdRemove,
  MdBrightnessLow,
  MdBrightness3
} from 'react-icons/md';;

import { MenuBar, MenuItem } from './MenuBar';
import { AdvancedDiv } from './AdvancedDiv';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');
const { app } = remote;

const TitleBar = ({ Config = null, stateTheme, addPopup, closeCurrentPopup, platform = 'windows' }) => {
  const [isDarkMode, setDarkMode] = useState<Boolean>(true);
  const [config, setConfig] = useState<any>(Config);
  const [menuItems, setMenuItems] = useState<Array<MenuItem>>(
    MenuItems(
      'dark',
      config,
      'windows',
      addPopup,
      stateTheme,
      closeCurrentPopup
    )
  );

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setMenuItems(MenuItems(data.themeType, data));
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveThemeType = value => {
    let tConfig = Object.assign({}, config);
    tConfig['themeType'] = value;
    setRxConfig(tConfig);
  };

  // Toggle the Dev Tools from Electron in the current window
  const showDevTools = () => {
    remote.getCurrentWindow().webContents.toggleDevTools();
  };

  // Toggles Between Dark and Light Mode
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
    saveThemeType(isDarkMode ? 'dark' : 'light');
  };

  return (<div style={stateTheme.titleBar}>
        {platform == 'windows' ? 
            <WindowsTitleBar 
                icon={".icon-ico/icon.ico"} 
                menuItems={menuItems} 
                Config={config} 
                stateTheme={stateTheme} 
                addPopup={addPopup} 
                closeCurrentPopup={closeCurrentPopup} 
                onDarkMode={toggleDarkMode} />
        : null}
    </div>
  );
};

const WindowsTitleBar = ({Config = null, stateTheme, addPopup, closeCurrentPopup, icon, menuItems, onDarkMode}) => {

    // minimize the current Window
    const minimize = () => {
      remote.getCurrentWindow().minimize();
    };

    // maximize the current window
    const maximize = () => {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
      } else {
        remote.getCurrentWindow().maximize();
      };
      setMaximized(isMaximized());
    };

    // Closes current window
    const close = () => {
      remote.getCurrentWindow().close();
    };

    // check if maximized
    const isMaximized = () => {
        return remote.getCurrentWindow().isMaximized();
    };

    // Declared maximized values (ables us to change the icon when maximzed or not)
    const [isMaximize, setMaximized] = useState(isMaximized());

    return (
        <div style={Object.assign({}, stateTheme.base.quinaryBackground, stateTheme.titleBar.windows.bar)}>
          <div style={stateTheme.titleBar.windows.bar.iconContainer}>
            <img style={stateTheme.titleBar.windows.bar.icon} src={icon} />
          </div>
          <div style={stateTheme.titleBar.windows.bar.contentContainer}>
            <MenuBar menuItems={menuItems} stateTheme={stateTheme} />
            <div style={stateTheme.titleBar.windows.bar.title}>
              {remote.getCurrentWindow().getTitle()}
            </div>
            <div style={stateTheme.titleBar.windows.bar.versionTag}>{app.getVersion()}</div>
          </div>
          <div style={stateTheme.titleBar.windows.bar.windowControlsContainer}>
            <WindowsActionButton
              Config={Config}
              stateTheme={stateTheme}
              Icon={
                stateTheme == theme.dark ? 
                <MdBrightness3  style={stateTheme.titleBar.windows.bar.actions.icon.svg} /> : 
                <MdBrightnessLow  style={stateTheme.titleBar.windows.bar.actions.icon.svg} />
              }
              isClose={false}
              onClick={() => {
                onDarkMode();
              }}
            />
            <WindowsActionButton
              Config={Config}
              stateTheme={stateTheme}
              Icon={<MdRemove style={stateTheme.titleBar.windows.bar.actions.icon.svg}/>}
              isClose={false}
              onClick={() => {
                minimize();
              }}
            />
            <WindowsActionButton
              Config={Config}
              stateTheme={stateTheme}
              Icon={isMaximize ? 
                <MdFlipToFront style={stateTheme.titleBar.windows.bar.actions.icon.svg}/>
               : 
                <MdCheckBoxOutlineBlank  style={Object.assign({}, stateTheme.titleBar.windows.bar.actions.icon.svg.maximized, stateTheme.titleBar.windows.bar.actions.icon.svg)} />}
              isClose={false}
              onClick={() => {
                maximize();
              }}
            />
            <WindowsActionButton
              Config={Config}
              stateTheme={stateTheme}
              Icon={<MdClose style={stateTheme.titleBar.windows.bar.actions.icon.svg} />}
              isClose={true}
              onClick={() => {
                close();
              }}
            />
          </div>
        </div>
      );
};

interface WindowsActionButton {
  Config?: {};
  stateTheme: any;
  Icon: Object;
  isClose: Boolean;
  style?: {};
  onClick?: () => void;
}

const WindowsActionButton = ({
  Config,
  stateTheme,
  Icon,
  isClose,
  style,
  onClick
}: WindowsActionButton) => {
  const [isHovering, setHovering] = useState<Boolean>(false);
  const [config, setConfig] = useState<any>(Config);

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <AdvancedDiv 
      style={{ width: '100%', height: '100%' }}
      aStyle={stateTheme.titleBar.windows.bar.actions}
      hoverStyle={isClose ? 
      stateTheme.titleBar.windows.bar.actions.hover.close : 
      stateTheme.menuBar.item.hover 
      }
      >
      <div
        onClick={onClick}
      >
        <div style={stateTheme.titleBar.windows.bar.actions.icon}>{Icon}</div>
      </div>
    </AdvancedDiv>
  );
};

export { TitleBar };
