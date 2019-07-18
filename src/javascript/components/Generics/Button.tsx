import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { AdvancedDiv } from './AdvancedDiv';
import { theme, ThemeContext } from '../../helpers';
import {
  MdSend,
  MdPerson,
  MdMood,
  MdFace,
  MdLocalMovies,
  MdEvent,
  MdFilterList
} from 'react-icons/md';

const Button = ({
  title,
  isSubmit = false,
  width = 'auto',
  isEnabled = true,
  onClick = null,
  stateTheme,
  buttonStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);

  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isenabled ? stateTheme.button.normal.disabled : null,
        Object.assign(
          {},
          isSubmit
            ? stateTheme.button.normal.submit
            : { width: width, 'margin-bottom': '10px' },
          Object.assign(
            {},
            stateTheme.base.tertiaryBackground,
            stateTheme.button.normal
          )
        )
      )}
      hoverStyle={Object.assign(
        {},
        theme.globals.accentBorderColor,
        stateTheme.button.normal.hover
      )}
      isButton={true}
      aStyle={buttonStyle}
    >
      <div onClick={onClick}>
        <span>{title}</span>
      </div>
    </AdvancedDiv>
  );
};

const DestructiveButton = ({
  title,
  isSubmit = false,
  width = 'auto',
  isEnabled = true,
  onClick = null,
  stateTheme,
  buttonStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);

  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isenabled ? stateTheme.button.normal.disabled : null,
        Object.assign(
          {},
          theme.globals.destructive,
          Object.assign(
            {},
            isSubmit
              ? stateTheme.button.normal.submit
              : { width: width, 'margin-bottom': '10px' },
            stateTheme.button.normal
          )
        )
      )}
      hoverStyle={Object.assign(
        {},
        theme.globals.accentBorderColor,
        stateTheme.button.normal.hover
      )}
      aStyle={buttonStyle}
    >
      <div onClick={onClick}>
        <span>{title}</span>
      </div>
    </AdvancedDiv>
  );
};

const ActionButton = ({
  title,
  isSubmit = false,
  width = 'auto',
  isEnabled = true,
  onClick = null,
  stateTheme,
  buttonStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);

  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isenabled ? stateTheme.button.normal.disabled : null,
        Object.assign(
          {},
          theme.globals.action,
          Object.assign(
            {},
            isSubmit
              ? stateTheme.button.normal.submit
              : { width: width, 'margin-bottom': '10px' },
            stateTheme.button.normal
          )
        )
      )}
      hoverStyle={Object.assign(
        {},
        theme.globals.accentBorderColor,
        stateTheme.button.normal.hover
      )}
      isButton={true}
      aStyle={buttonStyle}
    >
      <div onClick={onClick}>
        <span>{title}</span>
      </div>
    </AdvancedDiv>
  );
};

const IconButton = ({
  icon,
  width = 'auto',
  isEnabled = true,
  onClick = null,
  stateTheme,
  style = {},
  buttonStyle = {}
}) => {
  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isEnabled ? stateTheme.button.normal.disabled : null,
        Object.assign(
          {},
          Object.assign({}, stateTheme.button.sender, style),
          Object.assign({}, stateTheme.base.quinaryBackground, {
            borderColor: 'transparent'
          })
        )
      )}
      hoverStyle={Object.assign(
        {},
        Object.assign({}, theme.globals.accentFillColor, {
          borderColor: theme.globals.accentBorderColor.borderColor,
          fill: theme.globals.accentBackground.backgroundColor 
        }),
        stateTheme.button.sender.hover
      )}
      isButton={true}
      aStyle={buttonStyle}
      onClick={onClick}
    >
      {icon}
    </AdvancedDiv>
  );
};

const WidgetButton = ({
  icon,
  style = null,
  isEnabled = true,
  onClick = null,
  header = null,
  footer = null,
  stateTheme
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);

  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isenabled ? stateTheme.button.normal.disabled : null,
        Object.assign({}, stateTheme.button.widget)
      )}
      hoverStyle={Object.assign(
        {},
        { 
          cursor: 'pointer'
        },
        theme.globals.accentFillColor
      )}
      isButton={true}
      aStyle={Object.assign({}, stateTheme.button.widget, style)}
    >
      <div 
        onClick={onClick} 
        style={{
          'verticalAlign': 'middle',
          'display': 'flex'
      }}>
        {header != null ? header : null}
        {icon}
        {footer != null ? footer : null}
      </div>
    </AdvancedDiv>
  );
};

const LinkButton = ({
  title,
  isSubmit = false,
  width = 'auto',
  isEnabled = true,
  onClick = null,
  stateTheme,
  buttonStyle = {}
}) => {
  const [isenabled, setIsEnabled] = useState(isEnabled);

  return (
    <AdvancedDiv
      style={Object.assign(
        {},
        !isenabled ? stateTheme.button.normal.disabled : null,
        Object.assign(
          {},
          isSubmit
            ? stateTheme.button.normal.submit
            : { width: width, 'margin-bottom': '10px' },
          Object.assign(
            {},
            stateTheme.base.tertiaryBackground,
            stateTheme.button.normal.link
          )
        )
      )}
      hoverStyle={Object.assign(
        {},
        theme.globals.accentBorderColor,
        stateTheme.button.normal.hover
      )}
      isButton={true}
      aStyle={buttonStyle}
    >
      <div onClick={onClick}>
        <div style={stateTheme.button.normal.link.title}>{title}</div>
      </div>
    </AdvancedDiv>
  );
};

export {
  Button,
  DestructiveButton,
  ActionButton,
  IconButton,
  WidgetButton,
  LinkButton
};
