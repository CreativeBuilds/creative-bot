import * as React from 'react';

const theme = {
  globals: {
    accentBackground: {
      backgroundColor: "#ffd300",
      color: "#202225"
    },
    accentHighlight: {
      highlightColor: "#ffd300",
      color: "#202225"
    }, 
    accentForeground: {
      color: "#ffd300"
    },
    eventAccent: {
        backgroundColor: "#ffd300",
        color: "#202225"
    },
    destructiveButton: {
      backgroundColor: '#dc143c',
      color: '#f0f0f0',
      borderColor: '#dc143c'
    },
    actionButton: {
      backgroundColor: '#1e90ff',
      color: '#f0f0f0',
      borderColor: '#1e90ff'
    },
    blurred: {
      '-webkit-filter': 'blur(0px)'
    },
    transparent: {
        backgroundColor: "transparent"
    }
  },
  dark: {
    base: {
      background: {
          backgroundColor: "#070708",
          color: "#F8F8F7"
      },
      secondaryBackground: {
          backgroundColor: "#0e0f10",
          color: "#F1F1F1"
      },
      tertiaryBackground: {
          backgroundColor: "#141517",
          color: "#DFDDDA"
      },
      quaternaryBackground: {
          backgroundColor: "#1f1f1f",
          color: "#E0E0E0"
      },
      quinaryBackground: {
          backgroundColor: "#202225",
          color: "#CCCCCC"
      },
      foreground: {
          color: "#F8F8F7",
          fill: "#F8F8F7",
          stroke: "#F8F8F7"
      },
      secondaryForeground: {
          color: "#F1F1F1",
          fill: "#F1F1F1",
          stroke: "#F1F1F1"
      },
      tertiaryForeground: {
          color: "#DFDDDA",
          fill: "#DFDDDA",
          stroke: "#DFDDDA"
      },
      quaternaryForeground: {
          color: "#E0E0E0",
          fill: "#E0E0E0",
          stroke: "#E0E0E0"
      },
      quinaryForeground: {
          color: "#CCCCCC",
          fill: "#CCCCCC",
          stroke: "#CCCCCC"
      }
    },
    seperator: {

    },
    cell: {
      normal: {
        backgroundColor: "#202225",
        color: "#CCCCCC"
      },
      alternate: {
        backgroundColor: "#0e0f10",
        color: "#F1F1F1"
      }
    },
    toolBar: {
      'border-bottom': '4px solid #202225',
      'font-size': '30px'
    },
    button: {

    },
    submitButton: {
      backgroundColor: '#141517',
      color: '#f0f0f0',
      borderColor: '#141517'
    },
    disabledSubmitButton: {
      backgroundColor: '#191a1c',
      color: '#d0d0d0',
      borderColor: '#191a1c'
    },
    searchInput: {
      backgroundColor: '#0e0f10',
      color: '#0f0f0f',
      borderColor: '#0e0f10'
    },
    timeStamp: {
      color: "#AAAAAA"
    },
    dashedBorder: {
      border: '3px dashed #f0f0f0',
      'box-sizing': 'border-box'
    }
  },
  light: {
    base: {
      background: {
          backgroundColor: "#F8F8F7",
          color: "#070708"
      },
      secondaryBackground: {
          backgroundColor: "#F1F1F1",
          color: "#0e0e10"
      },
      tertiaryBackground: {
          backgroundColor: "#DFDDDA",
          color: "#202225"
      },
      quaternaryBackground: {
          backgroundColor: "#E0E0E0",
          color: "#1f1f1f"
      },
      quinaryBackground: {
          backgroundColor: "#CCCCCC",
          color: "#333333"
      },
      foreground: {
          color: "#070708",
          fill: "#070708",
          stroke: "#070708"
      },
      secondaryForeground: {
          color: "#0e0e10",
          fill: "#0e0e10",
          stroke: "#0e0e10"
      },
      tertiaryForeground: {
          color: "#202225",
          fill: "#202225",
          stroke: "#202225"
      },
      quaternaryForeground: {
          color: "#1f1f1f",
          fill: "#1f1f1f",
          stroke: "#1f1f1f"
      },
      quinaryForeground: {
          color: "#333333",
          fill: "#333333",
          stroke: "#333333"
      }
    },
    seperator: {

    },
    cell: {
      normal: {
        backgroundColor: '#ffffff',
        color: '#202225',
      },
      alternate: {
        backgroundColor: '#eeeeee',
        color: '#202225'
      }
    },
    toolBar: {
      'border-bottom': '4px solid #cccccc',
      'font-size': '30px'
    },
    submitButton: {
      backgroundColor: `#eeeeee`,
      color: '#202225',
      borderColor: `#eeeeee`
    },
    disabledSubmitButton: {
      backgroundColor: '#dddddd',
      color: '#202225',
      borderColor: '#dddddd'
    },
    searchInput: {
      backgroundColor: `#F1F1F1`,
      color: '#202225',
      borderColor: `#F1F1F1`
    },
    timeStamp: {
      color: '#555555'
    },
    dashedBorder: {
      border: '3px dashed #202225',
      'box-sizing': 'border-box'
    }
  }
};

const ThemeContext = React.createContext({ stateTheme: theme.dark });

export { ThemeContext, theme };
