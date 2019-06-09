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
    transparent: {
        backgroundColor: "transparent"
    }
  },
  dark: {
    base: {
      background: {
          backgroundColor: "#0e0f10",
          color: "#F1F1F1"
      },
      secondaryBackground: {
          backgroundColor: "#141517",
          color: "#DFDDDA"
      },
      tertiaryBackground: {
          backgroundColor: "#1f1f1f",
          color: "#E0E0E0"
      },
      quaternaryBackground: {
          backgroundColor: "#202225",
          color: "#CCCCCC"
      },
      quinaryBackground: {
          backgroundColor: "#424242",
          color: "#BDBDBD"
      },
      foreground: {
          color: "#F1F1F1",
          fill: "#F1F1F1",
          stroke: "#F1F1F1"
      },
      secondaryForeground: {
          color: "#DFDDDA",
          fill: "#DFDDDA",
          stroke: "#DFDDDA"
      },
      tertiaryForeground: {
          color: "#E0E0E0",
          fill: "#E0E0E0",
          stroke: "#E0E0E0"
      },
      quaternaryForeground: {
          color: "#CCCCCC",
          fill: "#CCCCCC",
          stroke: "#CCCCCC"
      },
      quinaryForeground: {
          color: "#BDBDBD",
          fill: "#BDBDBD",
          stroke: "#BDBDBD"
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
    searchInput: {
      backgroundColor: '#0e0f10',
      color: '#f0f0f0',
      borderColor: '#0e0f10'
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
    segmentControlHeader: {
      backgroundColor: '#000000',
      Color: '#ffffff'
    },
    segmentControlItem: {
      Color: '#ffffff'
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
        secondAlternate: {
          backgroundColor: 'rgb(24, 25, 26)',
          color: '#f0f0f0'
        },
        alternate: {
          backgroundColor: 'rgb(14, 15, 16)',
          color: '#f0f0f0'
        }
      }
    }
  },
  light: {
    base: {
      background: {
          backgroundColor: "#F1F1F1",
          color: "#0e0e10"
      },
      secondaryBackground: {
          backgroundColor: "#DFDDDA",
          color: "#202225"
      },
      tertiaryBackground: {
          backgroundColor: "#E0E0E0",
          color: "#1f1f1f"
      },
      quaternaryBackground: {
          backgroundColor: "#CCCCCC",
          color: "#333333"
      },
      quinaryBackground: {
        backgroundColor: "#BDBDBD",
        color: "#424242"
      },
      foreground: {
          color: "#0e0e10",
          fill: "#0e0e10",
          stroke: "#0e0e10"
      },
      secondaryForeground: {
          color: "#202225",
          fill: "#202225",
          stroke: "#202225"
      },
      tertiaryForeground: {
          color: "#1f1f1f",
          fill: "#1f1f1f",
          stroke: "#1f1f1f"
      },
      quaternaryForeground: {
          color: "#333333",
          fill: "#333333",
          stroke: "#333333"
      },
      quinaryForeground: {
        color: "#424242",
        fill: "#424242",
        stroke: "#424242"
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
    button: {

    },
    submitButton: {
      backgroundColor: `#eeeeee`,
      color: '#202225',
      borderColor: `#eeeeee`
    },
    searchInput: {
      backgroundColor: `#F1F1F1`,
      color: '#202225',
      borderColor: `#F1F1F1`
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
    segmentControlHeader: {
      backgroundColor: '#cccccc',
      Color: '#000000'
    },
    segmentControlItem: {
      Color: '#212121'
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
        secondAlternate: {
          backgroundColor: '#dddddd',
          color: '#202225'
        },
        alternate: {
          backgroundColor: '#eeeeee',
          color: '#202225'
        }
      }
    }
  }
};

const ThemeContext = React.createContext({ stateTheme: theme.dark });

export { ThemeContext, theme };
