import * as React from 'react';
import { rxConfig, setRxConfig } from '../helpers/rxConfig';
const { ipcRenderer, shell, remote, webFrame } = require('electron');

const theme = {
  dark: {
    transparent: {
      backgroundColor: 'transparent'
    },
    main: {
      backgroundColor: '#202225',
      color: '#f0f0f0',
      fill: '#f0f0f0',
      highlightColor: '#ffd300'
    },
    menu: {
      backgroundColor: '#141517',
      color: '#f0f0f0',
      title: {
        'border-bottom': '4px solid #202225',
        'font-size': '30px'
      },
      title_hover: {
        backgroundColor: '#0e0f10'
      }
    },
    titleBar: {
      backgroundColor: '#202225',
      color: '#CCCCCC',
    },
    titleBarActionIcon: {
      '-webkit-filter': 'invert(80%)'
    },
    titleBarHover: {
      backgroundColor: 'hsla(0,0%,100%,.1)'
    },
    menuItemSelected: {
      backgroundColor: '#1f1f1f',
    },
    contextMenu: {
      backgroundColor: '#1f1f1f',
      color: '#b4b4b4'

    },
    chat: {
      input: {
        backgroundColor: '#202225',
        color: '#f0f0f0'
      },
      message: {
        backgroundColor: '#202225',
        color: '#f0f0f0',
        alternate: {
          backgroundColor: 'rgb(14, 15, 16)',
          color: '#f0f0f0'
        }
      }
    }
  },
  light: {
    transparent: {
      backgroundColor: 'transparent'
    },
    main: {
      backgroundColor: '#ffffff',
      color: `#202225`,
      highlightColor: '#ffd300'
    },
    menu: {
      backgroundColor: `#eeeeee`,
      color: '#202225',
      highlightColor: '#ffd3000',
      title: {
        'border-bottom': '4px solid #cccccc',
        'font-size': '30px'
      },
      title_hover: {
        backgroundColor: '#dddddd'
      }
    },
    titleBar: {
      backgroundColor: '#cccccc',
      color: '#333333'
    },
    titleBarActionIcon: {
      '-webkit-filter': 'invert(30%)'
    },
    titleBarHover: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    menuItemSelected: {
      backgroundColor: '#e3e3e3',
    },
    contextMenu: {
      backgroundColor: '#e3e3e3',
      color: '#1f1f1f'

    },
    chat: {
      input: {
        backgroundColor: '#ffffff',
        color: '#202225'
      },
      message: {
        backgroundColor: '#ffffff',
        color: '#202225',
        alternate: {
          backgroundColor: '#eeeeee',
          color: '#202225'
        }
      }
    }
  }
};

var themeObj: any = null;

const changeTheme = (themeVal : String) => {
  if (themeVal == 'dark') {
    themeObj = theme.dark;
  } else if (themeVal == 'light') {
    themeObj = theme.light;
  }
}

ipcRenderer.send('getAppTheme');
ipcRenderer.on('change-theme-nochange', function(event, args) { 
  var themeVal = args as string
  changeTheme(themeVal);
});

const ThemeContext = React.createContext({ stateTheme: themeObj });

export { ThemeContext, theme };
