import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { AdvancedDiv } from '../AdvancedDiv';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace, MdLocalMovies, MdEvent, MdFilterList } from 'react-icons/md';

const Button = ({title, isSubmit = false, width = 'auto', isEnabled = true, onClick = null, stateTheme, buttonStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);

    return (
        <AdvancedDiv
          style={Object.assign({}, !isenabled ? stateTheme.button.normal.disabled : null, 
            Object.assign({}, isSubmit ? stateTheme.button.normal.submit : {width: width, 'margin-bottom': '10px'} , 
                Object.assign({}, stateTheme.base.tertiaryBackground, stateTheme.button.normal)))}
          hoverStyle={Object.assign({}, theme.globals.accentBorderColor, stateTheme.button.normal.hover)}
          isButton={true}
          aStyle={buttonStyle}
        >
          <div
            onClick={onClick}
          >
              <span>{title}</span>
          </div>
        </AdvancedDiv>
    );
}

const DestructiveButton = ({title, isSubmit = false, width = 'auto', isEnabled = true, onClick = null, stateTheme, buttonStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);

    return (
        <AdvancedDiv
          style={Object.assign({}, !isenabled ? stateTheme.button.normal.disabled : null, 
            Object.assign({}, theme.globals.destructive, 
                Object.assign({}, isSubmit ? stateTheme.button.normal.submit : {width: width, 'margin-bottom': '10px'} , stateTheme.button.normal)))}
          hoverStyle={Object.assign({}, theme.globals.accentBorderColor, stateTheme.button.normal.hover)}
          aStyle={buttonStyle}
        >
          <div
            onClick={onClick}
          >
            <span>{title}</span>
          </div>
        </AdvancedDiv>
    );
}

const ActionButton = ({title, isSubmit = false, width = 'auto', isEnabled = true, onClick = null, stateTheme, buttonStyle = {}}) => {
    
    const [isenabled, setIsEnabled] = useState(isEnabled);

    return (
        <AdvancedDiv
          style={Object.assign({}, !isenabled ? stateTheme.button.normal.disabled : null, 
            Object.assign({}, theme.globals.action, 
                Object.assign({}, isSubmit ? stateTheme.button.normal.submit : {width: width, 'margin-bottom': '10px'} , stateTheme.button.normal)))}
          hoverStyle={Object.assign({}, theme.globals.accentBorderColor, stateTheme.button.normal.hover)}
          isButton={true}
          aStyle={buttonStyle}
        >
          <div
            onClick={onClick}
          >
            <span>{title}</span>
          </div>
        </AdvancedDiv>
    );
}

export { Button, DestructiveButton, ActionButton }