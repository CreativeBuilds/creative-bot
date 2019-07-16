import * as React from 'react';

const theme = {
  globals: {
    accentBackground: {
      backgroundColor: '#ffd300',
      color: '#202225'
    },
    accentBorderColor: {
      borderColor: '#ffd300'
    },
    accentFillColor: {
      fill: '#ffd300'
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
      borderColor: '#b39400'
    },
    accentDarkFillColor: {
      fill: '#b39400'
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
          'font-weight': 'bold'
        }
      },
      content: {
        'backdrop-filter': 'blur(10px)',
        '-webkit-filter': 'blur(10px)'
      },
      contentBox: {
        padding: '15px',
        position: 'relative',
        iconContainer: {
          position: 'relative',
          height: '64px'
        },
        logo: {
          height: '64px',
          width: '64px',
          left: '0',
          right: '0',
          position: 'absolute',
          'text-align': 'center',
          margin: 'auto'
        },
        dragDropMessage: {
          'text-align': 'center',
          margin: 'auto',
          'word-wrap': 'break-word'
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
        userSelect: 'none'
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
        alignItems: 'center'
      },
      dialog: {
        width: '475px',
        maxHeight: '90%',
        overflow: 'auto',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
        content: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'flex-direction': 'column'
        }
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
          transition: 'all 0.15s ease-in-out'
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
        width: '85px'
      },
      stretched: {
        width: '100%',
        height: '25px',
        marginLeft: '0px !important',
        position: 'relative'
      },
      header: {
        compact: {
          height: 'auto',
          textAlign: 'center',
          width: 'auto',
          display: 'contents'
        },
        stretched: {
          display: 'inline-block',
          height: '100%'
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
          transition: 'all 0.15s ease-in-out',
          cursor: 'pointer',
        },
        isOn: {
          'margin-left': '50px'
        }
      }
    },
    slider: {
      width: '100%',
      padding: '0',
      headerContainer: {
        'margin-bottom': '0px',
        header: {
          display: 'inline-block',
          margin: '0'
        },
        value: {
          display: 'inline-block',
          margin: '0',
          float: 'right'
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
        border: '1.5px solid rgba(0,0,0,0)',
        submit: {
          'margin-bottom': '0px !important'
        },
        link: {
          backgroundColor: 'transparent',
          'text-align': 'center',
          'vertical-align': 'middle',
          'justify-content': 'center',
          'align-items': 'center',
          border: '1.5px solid rgba(0,0,0,0)',
          'border-radius': '5px',
          height: '40px',
          title: {
            'margin-top': '10px',
            'margin-bottom': '10px',
          }
        },
        disabled: {
          backgroundColor: '#191a1c',
          color: '#d0d0d0'
        },
        hover: {
          cursor: 'pointer',
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        }
      },
      sender: {
        cursor: 'pointer',
        'font-size': '2em',
        width: '63px',
        height: '100%',
        display: 'flex',
        flex: '1',
        'justify-content': 'center',
        'align-items': 'center',
        'margin-left': '5px',
        border: '2px solid rgba(0,0,0,0)',
        'border-radius': '5px',
        'box-sizing': 'border-box',
        disabled: {},
        hover: {
          borderWidth: '1.5px',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        }
      },
      widget: {
        'margin-right': '5px',
        display: 'inline-flex',
        'justify-content': 'center',
        'align-items': 'center',
        transition: 'all 0.15s ease-in-out',
        height: '100%',
        'vertical-align': 'middle',
        'margin-bottom': '2px',
        hamburger: {
          'font-size': '2.4em',
          position: 'absolute',
          top: '0',
          left: '0',
          'z-index': '1',
          'margin-left': '5px',
          display: 'inline',
          'vertical-align': 'middle',
          height: '44px',
          'margin-bottom': '12px',
          icon: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            verticalAlign: 'middle',
            marginTop: '3px',
          }
        },
        closeMenu: {
          'font-size': '2.4em',
          position: 'absolute',
          right: '0',
          transition: 'all 0.15s',
          icon: {
            fontSize: '1em',
            position: 'absolute',
            right: '0',
            top: '0',
            marginTop: '6px',
            transition: 'all 0.15s'
          }
        },
        closePopup: {
          position: 'absolute',
          top: '10px',
          right: '5px',
          height: '32px',
          width: '32px',
          transition: 'all 0.15s',
          icon: {
            fontSize: '1.9em',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            position: 'absolute',
            transition: 'all 0.15s'
          }
        },
        add: {
          position: 'absolute',
          top: '1px',
          right: '160px',
          'font-size': '25px',
        },
        hover: {

        }
      }
    },
    input: {
      container: {
        display: 'flex',
        flexDirection: 'column'
      },
      header: {
        'margin-bottom': '2px'
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
        height: '100%',
        'flex-direction': 'unset !important',
        display: 'flex',
        width: '100%',
        border: '0px solid rgba(0,0,0,0)',
        hover: {
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        },
        textField: {
          flex: '1',
          'outline-width': '0',
          outline: 'none',
          resize: 'none',
          border: '2px solid rgba(0,0,0,0)',
          padding: '5px',
          height: '100% !important',
          width: '100% !important',
          transition: 'all 0.15s ease-in-out',
          'border-radius': '5px',
          color: '#CCCCCC',
          'font-size': '16px'
        }
      }
    },
    titleBar: {
      display: 'table-row',
      'min-width': '100%',
      '-webkit-app-region': 'drag',
      'user-select': 'none',
      width: '100%',
      windows: {
        bar: {
          width: '100%',
          height: '30px',
          display: 'block',
          transition: 'all 0.15s ease-in-out',
          iconContainer: {
            display: 'table-column',
            height: '30px',
            width: '35px',
            float: 'left',
          },
          contentContainer: {
            display: 'inline-flex',
            height: '30px',
            width: 'calc(100% - (35px + 140px))',
            float: 'left',
          },
          windowControlsContainer: {
            display: 'flex',
            'flex-grow': '0',
            'flex-shrink': '0',
            'text-align': 'center',
            position: 'relative',
            'z-index': '3000',
            '-webkit-app-region': 'no-drag',
            height: '100%',
            width: 'auto',
            'margin-left': 'auto',
          },
          icon: {
            width: '18px',
            margin: 'auto',
            'margin-top': '6px',
            display: 'block',
          },
          title: {
            flex: '0 1 auto',
            'font-size': '12px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'line-height': '30px',
            zoom: '1',
            'font-family': 'Segoe WPC,Segoe UI,sans-serif',
            transition: 'all 0.15s ease-in-out',
          },
          versionTag: {
            'font-size': '12px',
            height: '100%',
            'line-height': '30px',
            width: 'auto',
            'font-family': 'Segoe WPC,Segoe UI,sans-serif',
            'text-align': 'center',
            float: 'right',
            'padding-left': '5px',
            'padding-right': '5px',
            transition: 'all 0.15s ease-in-out',
          },
          actions: {
            display: 'inline-block',
            '-webkit-app-region': 'no-drag',
            height: '30px',
            width: '46px',
            'box-sizing': 'border-box',
            transition: 'all 0.15s ease-in-out',
            hover: {
              normal: { 
                backgroundColor: '#565656',
                filter: 'alpha(opacity=50)'
              },
              close: {
                backgroundColor: '#dc143c',
                color: '#CCCCCC',
                fill: '#CCCCCC'
              }
            },
            icon: {
              height: '100%',
              width: '100%',
              '-webkit-mask-size': '23.1%',
              position: 'relative',
              svg: {
                'vertical-align': 'middle',
                'text-align': 'center',
                position: 'absolute',
                top: '25%',
                right: '20%',
                bottom: '50%',
                left: '30%',
                maximized: {
                  width: '14px',
                  top: '25%',
                  right: '25%',
                  bottom: '50%',
                  left: '25%',
                }
              }
            }
          }
        }
      }
    },
    menuBar: {
      display: 'contents',
      margin: '0',
      padding: '0',
      height: '100%',
      width: 'auto',
      item: {
        display: 'inline-block',
        height: '100%',
        container: {
          display: 'block'
        },
        title: {
          display: 'flow-root',
          height: '30px',
          width: 'auto',
          'font-size': '12px',
          'line-height': '30px',
          '-webkit-app-region': 'no-drag',
          'font-family': 'Segoe WPC,Segoe UI,sans-serif',
          'text-align': 'center',
          'box-sizing': 'border-box',
          margin: '0',
          'padding-left': '10px',
          'padding-right': '10px',
        },
        hover: {
          cursor: 'pointer',
          backgroundColor: '#565656',
          filter: 'alpha(opacity=50)',
          color: '#CCCCCC',
          fill: '#CCCCCC'
        }
      }
    },
    contextMenu: {
      'list-style-type': 'none',
      display: 'contents',
      content: {
        position: 'absolute',
        'font-size': '12px',
        'background-color': '#1f1f1f',
        color: '#b4b4b4',
        margin: '0',
        'margin-top': '0px',
        padding: '0',
        width: 'auto',
        'min-width': '200px',
        'padding-top': '5px',
        'padding-bottom': '5px',
        'user-select': 'none',
        boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)',
        'z-index': '100000000000',
        submenu: {
          position: 'absolute',
          right: 0,
          'list-style-type': 'none',
          display: 'contents',
        }
      },
      item: {
        display: 'flow-root',
        height: 'auto',
        container: {
          display: 'flex',
          height: '26px',
          position: 'relative',
          submenu: {
            display: 'inline-block',
            float: 'right',
            position: 'absolute',
            right: '0',
            top: '0',
          }
        },
        content: {
          height: '26px',
          'padding-left': '0px',
          'padding-right': '15px',
          width: '100%',
          cursor: 'pointer', 
          title: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            display: 'inline-block', 
            height: 'auto',
            float: 'left',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            }
          },
          arrow: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            'margin-left': '20px',
            float: 'right',
            display: 'inline-block', 
            height: 'auto',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            },
            svg: {
              color: 'darkgrey',
              height: '18px',
              width: '18px',
              fill: 'darkgrey',
              stroke: 'darkgrey',
            }
          },
          shortcut: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            'margin-left': '20px',
            width: '34px',
            display: 'table', 
            height: 'auto',
            float: 'right',
            color: 'darkgrey',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            }
          },
          iconContainer: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            display: 'inline', 
            height: 'auto',
            width: '42px',
            float: 'left',
            icon: {
              height: 'auto',
              width: '16px',
              float: 'right',
              display: 'inline',
              svg: {
                'vertical-align': 'middle',
                height: '16px',
                width: '16px',
              }
            },
            checkedIcon: {
              'margin-left': '5px',
              height: 'auto',
              width: '12px',
              'margin-right': '5px',
              display: 'inline',
              svg: {
                'vertical-align': 'middle',
                height: '12px',
                width: '12px',
              }
            }
          }
        },
        inactive: {
          color: 'gray'
        },
        seperator: {
          display: 'block',
          height: '0.5px',
          border: '0',
          'border-top': '0.5px solid #616161',
          padding: '0',
        },
        hover: {
          color: 'black',
          fill: 'black',
          stroke: 'black',
        }
      }
    },
    main: {
      width: '100%',
      height: '100%',
      display: 'table-cell',
      position: 'inherit',
      frame: {
        display: 'table',
        'min-height': '100%',
        'min-width': '100%',
        position: 'relative',
      },
      titleBar: {
        display: 'table-row',
        height: '30px',
        'min-width': '100%',    
      }
    },
    menu: {
      width: '250px',
      height: '100vh',
      position: 'absolute',
      transition: 'all 0.5s',
      top: '0',
      'z-index': '9999999',
      'list-style-type': 'none',
      popout: {
        left: '-250px',
      },
      toggled: {
        left: '0',
        'box-shadow': '5px 5px 5px rgba(0, 0, 0, 0.5)',
      },
      ul: {
        'list-style-type': 'none',
        padding: '0px',
        margin: '0px'
      },
      item: {
        header: {
          'font-size': '24px',
        },
        padding: '0px',
        margin: '0px',
        'font-size': '20px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        height: '48px',
      }
    },
    messageBar: {
      width: 'calc(100% - 10px)',
      height: '48px',
      display: 'flex',
      border: '5px solid rgba(0, 0, 0, 0)',
    },
    page: {
      width: '100%',
      height: '100%',
      'min-width': '275px',
      display: 'flex',
      'align-items': 'center',
      'flex-direction': 'column',
      header: {
        height: '44px',
        width: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'border-bottom': '4px solid #202225',
         'font-size': '30px',
         position: 'relative',
      },
      content: {
        flex: '1',
        'overflow-y': 'auto',
        width: 'calc(100% - 10px)',
        padding: '5px',
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
          'font-weight': 'bold'
        }
      },
      content: {
        'backdrop-filter': 'blur(10px)',
        '-webkit-filter': 'blur(10px)'
      },
      contentBox: {
        padding: '15px',
        position: 'relative',
        iconContainer: {
          position: 'relative',
          height: '64px'
        },
        logo: {
          height: '64px',
          width: '64px',
          left: '0',
          right: '0',
          position: 'absolute',
          'text-align': 'center',
          margin: 'auto'
        },
        dragDropMessage: {
          'text-align': 'center',
          margin: 'auto',
          'word-wrap': 'break-word'
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
        userSelect: 'none'
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
        alignItems: 'center'
      },
      dialog: {
        width: '475px',
        maxHeight: '90%',
        overflow: 'auto',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
        content: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'flex-direction': 'column'
        }
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
          transition: 'all 0.15s ease-in-out'
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
        width: '85px'
      },
      stretched: {
        width: '100%',
        height: '25px',
        marginLeft: '0px !important',
        position: 'relative'
      },
      header: {
        compact: {
          height: 'auto',
          textAlign: 'center',
          width: 'auto',
          display: 'contents'
        },
        stretched: {
          display: 'inline-block',
          height: '100%'
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
          transition: 'all 0.15s ease-in-out',
          cursor: 'pointer',
        },
        isOn: {
          'margin-left': '50px'
        }
      }
    },
    slider: {
      width: '100%',
      padding: '0',
      headerContainer: {
        'margin-bottom': '0px',
        header: {
          display: 'inline-block',
          margin: '0'
        },
        value: {
          display: 'inline-block',
          margin: '0',
          float: 'right'
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
        border: '1.5px solid rgba(0,0,0,0)',
        submit: {
          width: 'calc(70% - 9px)',
          'margin-bottom': '0px'
        },
        link: {
          backgroundColor: 'transparent',
          'text-align': 'center',
          'vertical-align': 'middle',
          'justify-content': 'center',
          'align-items': 'center',
          border: '1.5px solid rgba(0,0,0,0)',
          'border-radius': '5px',
          height: '40px',
          title: {
            'margin-top': '10px',
            'margin-bottom': '10px',
          }
        },
        disabled: {
          backgroundColor: '#dddddd',
          color: '#202225'
        },
        hover: {
          cursor: 'pointer',
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
          
        }
      },
      sender: {
        cursor: 'pointer',
        'font-size': '2em',
        width: '63px',
        height: '100%',
        display: 'flex',
        flex: '1',
        'justify-content': 'center',
        'align-items': 'center',
        'margin-left': '5px',
        border: '2px solid rgba(0,0,0,0)',
        'border-radius': '5px',
        'box-sizing': 'border-box',
        disabled: {},
        hover: {
          borderWidth: '1.5px',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        }
      },
      widget: {
        'margin-right': '5px',
        display: 'inline-flex',
        'justify-content': 'center',
        'align-items': 'center',
        transition: 'all 0.15s ease-in-out',
        height: '100%',
        'vertical-align': 'middle',
        'margin-bottom': '2px',
        hamburger: {
          'font-size': '2.4em',
          position: 'absolute',
          top: '0',
          left: '0',
          'z-index': '1',
          'margin-left': '5px',
          display: 'inline',
          'vertical-align': 'middle',
          height: '44px',
          'margin-bottom': '12px',
          icon: {
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            verticalAlign: 'middle',
            marginTop: '3px',
          }
        },
        closeMenu: {
          'font-size': '2.4em',
          position: 'absolute',
          right: '0',
          transition: 'all 0.15s',
          icon: {
            fontSize: '1em',
            position: 'absolute',
            right: '0',
            top: '0',
            marginTop: '6px',
            transition: 'all 0.15s'
          }
        },
        closePopup: {
          position: 'absolute',
          top: '10px',
          right: '5px',
          height: '32px',
          width: '32px',
          transition: 'all 0.15s',
          icon: {
            fontSize: '1.9em',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            position: 'absolute',
            transition: 'all 0.15s'
          }
        },
        add: {
          position: 'absolute',
          top: '1px',
          right: '160px',
          'font-size': '25px',
        },
        hover: {

        }
      }
    },
    input: {
      container: {
        display: 'flex',
        flexDirection: 'column'
      },
      header: {
        'margin-bottom': '2px'
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
        height: '100%',
        'flex-direction': 'unset !important',
        display: 'flex',
        width: '100%',
        border: '0px solid rgba(0,0,0,0)',
        hover: {
          cursor: 'pointer',
          border: '1.5px solid',
          boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)'
        },
        textField: {
          flex: '1',
          'outline-width': '0',
          outline: 'none',
          resize: 'none',
          border: '2px solid rgba(0,0,0,0)',
          padding: '5px',
          height: '100% !important',
          width: '100% !important',
          transition: 'all 0.15s ease-in-out',
          'border-radius': '5px',
          color: '#333333',
          'font-size': '16px'
        }
      }
    },
    titleBar: {
      display: 'table-row',
      'min-width': '100%',
      '-webkit-app-region': 'drag',
      'user-select': 'none',
      width: '100%',
      windows: {
        bar: {
          width: '100%',
          height: '30px',
          display: 'block',
          transition: 'all 0.15s ease-in-out',
          iconContainer: {
            display: 'table-column',
            height: '30px',
            width: '35px',
            float: 'left',
          },
          contentContainer: {
            display: 'inline-flex',
            height: '30px',
            width: 'calc(100% - (35px + 140px))',
            float: 'left',
          },
          windowControlsContainer: {
            display: 'flex',
            'flex-grow': '0',
            'flex-shrink': '0',
            'text-align': 'center',
            position: 'relative',
            'z-index': '3000',
            '-webkit-app-region': 'no-drag',
            height: '100%',
            width: 'auto',
            'margin-left': 'auto',
          },
          icon: {
            width: '18px',
            margin: 'auto',
            'margin-top': '6px',
            display: 'block',
          },
          title: {
            flex: '0 1 auto',
            'font-size': '12px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'line-height': '30px',
            zoom: '1',
            'font-family': 'Segoe WPC,Segoe UI,sans-serif',
            transition: 'all 0.15s ease-in-out',
          },
          versionTag: {
            'font-size': '12px',
            height: '100%',
            'line-height': '30px',
            width: 'auto',
            'font-family': 'Segoe WPC,Segoe UI,sans-serif',
            'text-align': 'center',
            float: 'right',
            'padding-left': '5px',
            'padding-right': '5px',
            transition: 'all 0.15s ease-in-out',
          },
          actions: {
            display: 'inline-block',
            '-webkit-app-region': 'no-drag',
            height: '30px',
            width: '46px',
            'box-sizing': 'border-box',
            transition: 'all 0.15s ease-in-out',
            hover: {
              normal: { 
                backgroundColor: '#565656',
                filter: 'alpha(opacity=50)'
              },
              close: {
                backgroundColor: '#dc143c',
                color: '#CCCCCC',
                fill: '#CCCCCC'
              }
            },
            icon: {
              height: '100%',
              width: '100%',
              '-webkit-mask-size': '23.1%',
              position: 'relative',
              svg: {
                'vertical-align': 'middle',
                'text-align': 'center',
                position: 'absolute',
                top: '25%',
                right: '20%',
                bottom: '50%',
                left: '30%',
                maximized: {
                  width: '14px',
                  top: '25%',
                  right: '25%',
                  bottom: '50%',
                  left: '25%',
                }
              }
            }
          }
        }
      }
    },
    menuBar: {
      display: 'contents',
      margin: '0',
      padding: '0',
      height: '100%',
      width: 'auto',
      item: {
        display: 'inline-block',
        height: '100%',
        container: {
          display: 'block'
        },
        title: {
          display: 'flow-root',
          height: '30px',
          width: 'auto',
          'font-size': '12px',
          'line-height': '30px',
          '-webkit-app-region': 'no-drag',
          'font-family': 'Segoe WPC,Segoe UI,sans-serif',
          'text-align': 'center',
          'box-sizing': 'border-box',
          margin: '0',
          'padding-left': '10px',
          'padding-right': '10px',
        },
        hover: {
          cursor: 'pointer',
          backgroundColor: '#565656',
          filter: 'alpha(opacity=50)',
          color: '#CCCCCC',
          fill: '#CCCCCC'
        }
      }
    },
    contextMenu: {
      'list-style-type': 'none',
      display: 'contents',
      content: {
        position: 'absolute',
        'font-size': '12px',
        'background-color': '#1f1f1f',
        color: '#b4b4b4',
        margin: '0',
        'margin-top': '0px',
        padding: '0',
        width: 'auto',
        'min-width': '200px',
        'padding-top': '5px',
        'padding-bottom': '5px',
        'user-select': 'none',
        boxShadow: '2.5px 2.5px 5px rgba(0,0,0,0.5)',
        'z-index': '100000000000',
        submenu: {
          position: 'absolute',
          right: 0,
          'list-style-type': 'none',
          display: 'contents',
        }
      },
      item: {
        display: 'flow-root',
        height: 'auto',
        container: {
          display: 'flex',
          height: '26px',
          position: 'relative',
          submenu: {
            display: 'inline-block',
            float: 'right',
            position: 'absolute',
            right: '0',
            top: '0',
          }

        },
        content: {
          height: '26px',
          'padding-left': '0px',
          'padding-right': '15px',
          width: '100%',
          cursor: 'pointer', 
          title: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            display: 'inline-block', 
            height: 'auto',
            float: 'left',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            }
          },
          arrow: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            'margin-left': '20px',
            float: 'right',
            display: 'inline-block', 
            height: 'auto',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            },
            svg: {
              color: 'darkgrey',
              height: '18px',
              width: '18px',
              fill: 'darkgrey',
              stroke: 'darkgrey',
            }
          },
          shortcut: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            'margin-left': '20px',
            width: '34px',
            display: 'table', 
            height: 'auto',
            float: 'right',
            color: 'darkgrey',
            span: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': 'normal',
            }
          },
          iconContainer: {
            'padding-bottom': '5px',
            'padding-top': '5px',
            'margin-right': '10px',
            display: 'inline', 
            height: 'auto',
            width: '36px',
            float: 'left',
            icon: {
              height: 'auto',
              width: '16px',
              float: 'right',
              svg: {
                'vertical-align': 'middle',
                height: '16px',
                width: '16px',
              }
            },
            checkedIcon: {
              height: 'auto',
              width: '12px',
              'margin-right': '5px',
              svg: {
                'vertical-align': 'middle',
                height: '12px',
                width: '12px',
              }
            }
          }
        },
        inactive: {
          color: 'gray'
        },
        seperator: {
          display: 'block',
          height: '0.5px',
          border: '0',
          'border-top': '0.5px solid #616161',
          padding: '0',
        },
        hover: {
          color: 'black',
          fill: 'black',
          stroke: 'black',
        }
      }
    },
    main: {
      width: '100%',
      height: '100%',
      display: 'table-cell',
      position: 'inherit',
      frame: {
        display: 'table',
        'min-height': '100%',
        'min-width': '100%',
        position: 'relative',
      },
      titleBar: {
        display: 'table-row',
        height: '30px',
        'min-width': '100%',    
      }
    },
    menu: {
      width: '250px',
      height: '100vh',
      position: 'absolute',
      transition: 'all 0.5s',
      top: '0',
      'z-index': '9999999',
      'list-style-type': 'none',
      popout: {
        left: '-250px',
      },
      toggled: {
        left: '0',
        'box-shadow': '5px 5px 5px rgba(0, 0, 0, 0.5)',
      },
      ul: {
        'list-style-type': 'none',
        padding: '0px',
        margin: '0px'
      },
      item: {
        header: {
          'font-size': '24px',
        },
        padding: '0px',
        margin: '0px',
        'font-size': '20px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        height: '48px',
      }
    },
    messageBar: {
      width: 'calc(100% - 10px)',
      height: '48px',
      display: 'flex',
      border: '5px solid rgba(0, 0, 0, 0)',
    },
    page: {
      width: '100%',
      height: '100%',
      'min-width': '275px',
      display: 'flex',
      'align-items': 'center',
      'flex-direction': 'column',
      header: {
        height: '44px',
        width: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'border-bottom': '4px solid #cccccc',
        'font-size': '30px',
        position: 'relative',
      },
      content: {
        flex: '1',
        'overflow-y': 'auto',
        width: 'calc(100% - 10px)',
        padding: '5px',
      }
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