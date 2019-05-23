import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import { theme, ThemeContext, MenuItems } from '../../helpers';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');
const { app } = remote;

const styles: any = require('./TitleBar.scss');

interface WindowsActionButton {
    Config?: {},
    Icon: Object,
    type: any,
    onClick?: () => void
}

const WindowsActionButton = ({ Config, Icon, type, onClick } : WindowsActionButton) => {

    const [stateTheme, setStateTheme] = useState(theme);
    const [isHovering, setHovering] = useState<Boolean>(false);
    const [config, setConfig] = useState<any>(Config);

    const changeTheme = (themeVal : String) => {
        if (themeVal == 'dark') {
          setStateTheme(theme.dark); 
        } else if (themeVal == 'light') {
          setStateTheme(theme.light);
        }   
    }

    useEffect(() => {
        let listener = rxConfig.subscribe((data: any) => {
          delete data.first;
          setConfig(data);
          changeTheme(data.themeType);
        });
        return () => {
          listener.unsubscribe();
        };
    }, []);

    const getType = (value) => {
      if (value == 'appearance') {
        return styles.appearance;
      } else if (value == 'minimize') {
        return styles.minimize;
      } else if (value == 'maximize') {
        return styles.maximize;
      } else if (value == 'close') {
        return styles.close;
      }
    }

    return (
        <div className={`${styles.actionBtn} ${getType(type)}`} style={isHovering ? stateTheme.titleBarHover : null} onClick={onClick} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <div className={`${styles.icon}`} >
                {Icon}
            </div>
        </div>
    );
}

export { WindowsActionButton }