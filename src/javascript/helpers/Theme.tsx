import * as React from 'react';

const theme = {
    dark: {
      main: {
        backgroundColor: '#202225',
        color: '#f0f0f0',
        highlightColor: '#ffd300'
      },
      menu: {
          backgroundColor: '#141517',
          title: {
            "border-bottom": '4px solid #202225',
            "font-size":"30px"
          },
          "title_hover":{
              backgroundColor: '#0e0f10'
          }
      },
      chat: {
        input: {
          backgroundColor: "#202225",
          color: "#f0f0f0"
        }
      }
    },
    light: {
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
            "border-bottom": '4px solid #cccccc',
            "font-size": "30px"
          },
          "title_hover":{
              backgroundColor: '#dddddd'
          }
      }
    }
  };
  
  const ThemeContext = React.createContext({stateTheme: theme.dark});

  export {ThemeContext, theme};