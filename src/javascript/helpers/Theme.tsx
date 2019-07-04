import * as React from 'react';

const theme = {
  globals: {
    accentBackground: {
      backgroundColor: '#ffd300',
      color: '#202225'
    },
    accentBorderColor: {
      color: '#ffd300',
      fill: '#ffd300',
      borderColor: '#ffd300',
    },
    accentHighlight: {
      highlightColor: '#ffd300',
      color: '#202225'
    },
    accentForeground: {
      color: '#ffd300'
    },
    accentDarkBackground: {
      backgroundColor: '#b39400',
      color: '#202225'
    },
    accentDarkBorderColor: {
      color: '#b39400',
      fill: '#b39400',
      borderColor: '#b39400',
    },
    accentDarkHighlight: {
      highlightColor: '#b39400',
      color: '#202225'
    },
    accentDarkForeground: {
      color: '#b39400'
    },
    eventAccent: {
      backgroundColor: '#ffd300',
      color: '#202225'
    },
    destructive: {
      backgroundColor: '#dc143c',
      color: '#f0f0f0',
      borderColor: '#dc143c'
    },
    action: {
      backgroundColor: '#1e90ff',
      color: '#f0f0f0',
      borderColor: '#1e90ff'
    },
    blurred: {
      '-webkit-filter': 'blur(0px)'
    },
    transparent: {
      backgroundColor: 'transparent'
    }
  },
  dark: {
    base: {
      background: {
        backgroundColor: '#070708',
        color: '#F8F8F7'
      },
      secondaryBackground: {
        backgroundColor: '#0e0f10',
        color: '#F1F1F1'
      },
      tertiaryBackground: {
        backgroundColor: '#141517',
        color: '#DFDDDA'
      },
      quaternaryBackground: {
        backgroundColor: '#1f1f1f',
        color: '#E0E0E0'
      },
      quinaryBackground: {
        backgroundColor: '#202225',
        color: '#CCCCCC'
      },
      foreground: {
        color: '#F8F8F7',
        fill: '#F8F8F7',
        stroke: '#F8F8F7'
      },
      secondaryForeground: {
        color: '#F1F1F1',
        fill: '#F1F1F1',
        stroke: '#F1F1F1'
      },
      tertiaryForeground: {
        color: '#DFDDDA',
        fill: '#DFDDDA',
        stroke: '#DFDDDA'
      },
      quaternaryForeground: {
        color: '#E0E0E0',
        fill: '#E0E0E0',
        stroke: '#E0E0E0'
      },
      quinaryForeground: {
        color: '#CCCCCC',
        fill: '#CCCCCC',
        stroke: '#CCCCCC'
      }
    },
    dragDrop: {
      display: 'inline-block',
      position: 'relative',
      'box-sizing': 'border-box',
      width: '100%',  
      draggedBackground: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        'z-index': '9999',
        'border-radius': '10px',
        padding: '-10px !important',
        margin: '-10px !important',
        title: {
          position: 'absolute',
          top: '45%',
          right: '0',
          left: '0',
          'text-align': 'center',
          'font-size': '20px',
          'font-weight': 'bold',
        }
      },
      content: {
        'backdrop-filter': 'blur(10px)',
        '-webkit-filter': 'blur(10px)',
      },
      contentBox: {
        padding: '15px',
        position: 'relative',
        iconContainer: {
          position: 'relative',
          height: '64px',
        },   
        logo: { 
          height: '64px', 
          width: '64px',
          left: '0',
          right: '0',
          position: 'absolute',
          'text-align': 'center',
          margin: 'auto',
        },
        dragDropMessage: {  
          'text-align': 'center',
          margin: 'auto',
          'word-wrap': 'break-word',
        }
      }
    },
    checkbox: {
      height: '24px',
      width: '24px',
      border: '3px solid',
      padding: '0px !important',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      tick: {
        'stroke-width': '2px',
        'font-size': '1.2em'
      }
    },
    panel: {
      padding: '10px',
      'border-radius': '10px',
    
      title: {
        textAlign: 'center',
        margin: '0',
        padding: '0',
        marginBottom: '10px',
        userSelect: 'none',
      }
    },
    popup: {
      overlay: {
        background: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '999999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dialog: {
        width: '475px',
        maxHeight: '90%',
        overflow: 'auto',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)'
      },
      close: {
        position: 'relative',
        icon: {
          zIndex: '999',
          fontSize: '2em',
          strokeWidth: '1px',
          position: 'absolute',
          top: '0',
          right: '0',
          transition: 'all 0.15s ease-in-out',
        }
      }
    },
    toggle: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
      position: 'relative',
      marginBottom: '7px',
      compact: {
        width: '85px',
      },
      stretched: {
        width: '100%',
        height: '25px',
        marginLeft: '0px !important',
        position: 'relative',
      },
      header: {
        compact: {
          height: 'auto',
          textAlign: 'center',
          width: 'auto',
          display: 'contents',
        },
        stretched: {
          display: 'inline-block',
          height: '100%',
        }
      },
      disabled: {
        color: 'rgb(127,127,127)',
        toggleBody: { 
          opacity: '0.5'
        }
      },
      toggleBody: {
        compact: {
          width: 'auto'
        },
        stretched: {
          position: 'absolute',
          right: '0px',
          marginRight: '10px'
        },
        transition: 'all 0.15s ease-in-out',
        borderRadius: '25px',
        width: '75px',
        height: '25px',
        handle: {
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          transition: 'all 0.15s ease-in-out'
        },
        isOn: {
          'margin-left': '50px'
        },
      }
    },
    slider: {
      width: '100%',
      padding: '0',
      headerContainer: {
        'margin-bottom': '0px',
        header: {
          display: 'inline-block', 
          margin: '0', 
        },
        value: {
          display: 'inline-block', 
          margin: '0',
          float: 'right', 
        }
      },
      input: {
        '-webkit-appearance': 'none',
        width: '100%',
        background: 'transparent',
        marginTop: '12px',
        height: '24px',
        position: 'relative'
      },
      rail: {
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        borderWidth: '0px',
        outline: 'none',
        padding: '0',
        position: 'absolute'
      },
      track: {
        height: '8px',
        borderRadius: '4px',
        borderWidth: '0px',
        outline: 'none',
        padding: '0',
        position: 'absolute'
      },
      thumb: {
        position: 'absolute',
        WebkitAppearance: 'none',
        height: '24px',
        width: '24px',
        borderRadius: '50%',
        cursor: 'pointer',
        marginTop: '-8px',
        marginLeft: '-10px',
        borderWidth: '0px',
        outline: 'none',
        boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d'
      }
    },    
    seperator: {},
    cell: {
      normal: {
        backgroundColor: '#202225',
        color: '#CCCCCC'
      },
      alternate: {
        backgroundColor: '#0e0f10',
        color: '#F1F1F1'
      }
    },
    toolBar: {
      'border-bottom': '4px solid #202225',
      'font-size': '30px'
    },
    button: {
      normal: {
        height: '25px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'font-size': '20px',
        padding: '6px',
        'border-radius': '5px',
        color: '#f0f0f0',
        transition: 'all 0.15s ease-in-out',
        submit: {
          'margin-bottom': '0px !important'
        },
        disabled: {
          backgroundColor: '#191a1c',
          color: '#d0d0d0',
        },
        hover: {
          cursor: 'pointer',
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        }
      },
      sender: {
        disabled: {

        },
        hover: {

        }
      }
    },
    input: {
      container: {
        display: 'flex', 
        flexDirection: 'column', 
      },
      text: {
        flex: '1',
        border: '0px solid #000',
        borderRadius: '5px',
        padding: '5px',
        outline: 'none',
        height: '20px',
        fontSize: '16px'
      },
      stepper: {
        flex: '1',
        border: '0px solid #000',
        borderRadius: '5px',
        padding: '5px',
        outline: 'none',
        height: '20px',
        fontSize: '16px'
      },
      message: {

      }
    },
    timeStamp: {
      color: '#AAAAAA'
    },
    dashedBorder: {
      border: '3px dashed #f0f0f0',
      'box-sizing': 'border-box'
    }
  },
  light: {
    base: {
      background: {
        backgroundColor: '#F8F8F7',
        color: '#070708'
      },
      secondaryBackground: {
        backgroundColor: '#F1F1F1',
        color: '#0e0e10'
      },
      tertiaryBackground: {
        backgroundColor: '#DFDDDA',
        color: '#202225'
      },
      quaternaryBackground: {
        backgroundColor: '#E0E0E0',
        color: '#1f1f1f'
      },
      quinaryBackground: {
        backgroundColor: '#CCCCCC',
        color: '#333333'
      },
      foreground: {
        color: '#070708',
        fill: '#070708',
        stroke: '#070708'
      },
      secondaryForeground: {
        color: '#0e0e10',
        fill: '#0e0e10',
        stroke: '#0e0e10'
      },
      tertiaryForeground: {
        color: '#202225',
        fill: '#202225',
        stroke: '#202225'
      },
      quaternaryForeground: {
        color: '#1f1f1f',
        fill: '#1f1f1f',
        stroke: '#1f1f1f'
      },
      quinaryForeground: {
        color: '#333333',
        fill: '#333333',
        stroke: '#333333'
      }
    },
    dragDrop: {
      display: 'inline-block',
      position: 'relative',
      'box-sizing': 'border-box',
      width: '100%',  
      draggedBackground: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        'z-index': '9999',
        'border-radius': '10px',
        padding: '-10px !important',
        margin: '-10px !important',
        title: {
          position: 'absolute',
          top: '45%',
          right: '0',
          left: '0',
          'text-align': 'center',
          'font-size': '20px',
          'font-weight': 'bold',
        }
      },
      content: {
        'backdrop-filter': 'blur(10px)',
        '-webkit-filter': 'blur(10px)',
      },
      contentBox: {
        padding: '15px',
        position: 'relative',
        iconContainer: {
          position: 'relative',
          height: '64px',
        },   
        logo: { 
          height: '64px', 
          width: '64px',
          left: '0',
          right: '0',
          position: 'absolute',
          'text-align': 'center',
          margin: 'auto',
        },
        dragDropMessage: {  
          'text-align': 'center',
          margin: 'auto',
          'word-wrap': 'break-word',
        }
      }
    },
    checkbox: {
      height: '24px',
      width: '24px',
      border: '3px solid',
      padding: '0px !important',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      tick: {
        'stroke-width': '2px',
        'font-size': '1.2em'
      }
    },
    panel: {
      padding: '10px',
      'border-radius': '10px',
    
      title: {
        textAlign: 'center',
        margin: '0',
        padding: '0',
        marginBottom: '10px',
        userSelect: 'none',
      }
    },
    popup: {
      overlay: {
        background: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '999999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dialog: {
        width: '475px',
        maxHeight: '90%',
        overflow: 'auto',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)'
      },
      close: {
        position: 'relative',
        icon: {
          zIndex: '999',
          fontSize: '2em',
          strokeWidth: '1px',
          position: 'absolute',
          top: '0',
          right: '0',
          transition: 'all 0.15s ease-in-out',
        }
      }
    },
    toggle: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
      position: 'relative',
      marginBottom: '7px',
      compact: {
        width: '85px',
      },
      stretched: {
        width: '100%',
        height: '25px',
        marginLeft: '0px !important',
        position: 'relative',
      },
      header: {
        compact: {
          height: 'auto',
          textAlign: 'center',
          width: 'auto',
          display: 'contents',
        },
        stretched: {
          display: 'inline-block',
          height: '100%',
        }
      },
      disabled: {
        color: 'rgb(127,127,127)',
        toggleBody: { 
          opacity: '0.5'
        }
      },
      toggleBody: {
        compact: {
          width: 'auto'
        },
        stretched: {
          position: 'absolute',
          right: '0px',
          marginRight: '10px'
        },
        transition: 'all 0.15s ease-in-out',
        borderRadius: '25px',
        width: '75px',
        height: '25px',
        handle: {
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          transition: 'all 0.15s ease-in-out'
        },
        isOn: {
          'margin-left': '50px'
        },
      }
    },
    slider: {
      width: '100%',
      padding: '0',
      headerContainer: {
        'margin-bottom': '0px',
        header: {
          display: 'inline-block', 
          margin: '0', 
        },
        value: {
          display: 'inline-block', 
          margin: '0',
          float: 'right', 
        }
      },
      input: {
        '-webkit-appearance': 'none',
        width: '100%',
        background: 'transparent',
        marginTop: '12px',
        height: '24px',
        position: 'relative'
      },
      rail: {
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        borderWidth: '0px',
        outline: 'none',
        padding: '0',
        position: 'absolute'
      },
      track: {
        height: '8px',
        borderRadius: '4px',
        borderWidth: '0px',
        outline: 'none',
        padding: '0',
        position: 'absolute'
      },
      thumb: {
        position: 'absolute',
        WebkitAppearance: 'none',
        height: '24px',
        width: '24px',
        borderRadius: '50%',
        cursor: 'pointer',
        marginTop: '-8px',
        marginLeft: '-10px',
        borderWidth: '0px',
        outline: 'none',
        boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d'
      }
    },
    seperator: {},
    cell: {
      normal: {
        backgroundColor: '#ffffff',
        color: '#202225'
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
      normal: {
        width: 'calc(70% - 9px)',
        height: '25px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'font-size': '20px',
        padding: '6px',
        'border-radius': '5px',
        color: '#f0f0f0',
        transition: 'all 0.15s ease-in-out',
        'margin-bottom': '10px',
        submit: {
          width: 'calc(70% - 9px)',
          'margin-bottom': '0px'
        },
        disabled: {
          backgroundColor: '#dddddd',
          color: '#202225',
        },
        hover: {
          cursor: 'pointer',
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        }
      },
      sender: {
        disabled: {

        },
        hover: {
          
        }
      }
    },
    input: {
      container: {
        display: 'flex', 
        flexDirection: 'column', 
      },
      text: {
        flex: '1',
        border: '0px solid #000',
        borderRadius: '5px',
        padding: '5px',
        outline: 'none',
        height: '20px',
        fontSize: '16px'
      },
      stepper: {
        flex: '1',
        border: '0px solid #000',
        borderRadius: '5px',
        padding: '5px',
        outline: 'none',
        height: '20px',
        fontSize: '16px'
      },
      message: {

      }
    },
    timeStamp: {
      color: '#555555'
    },
    dashedBorder: {
      border: '3px dashed #202225',
      'box-sizing': 'border-box',
    }
  }
};

const ThemeContext = React.createContext({ stateTheme: theme.dark });

export { ThemeContext, theme };
