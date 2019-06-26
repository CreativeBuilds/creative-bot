import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace, MdLocalMovies, MdEvent, MdFilterList } from 'react-icons/md';

const styles: any = require('./Toggle.scss');

enum ToggleType {
    compact,
    stretched
}

const Toggle = ({header, type, isOn, isEnabled, onClick, onChange = null, stateTheme}) => {

    const [ison, setIsOn] = useState(isOn);
    const [isenabled, setIsEnabled] = useState(isEnabled);

    return (
        <div className={`${!isenabled ? styles.disabled : null} `} style={
          Object.assign({}, type == ToggleType.stretched ? stateTheme.toggle.stretched : stateTheme.toggle.compact, stateTheme.toggle)
        }>
              <div style={Object.assign({}, type == ToggleType.stretched ? stateTheme.toggle.header.stretched : stateTheme.toggle.header.compact)}>{header}</div>
              <div style={
                Object.assign({},
                   Object.assign({}, stateTheme.base.background, type == ToggleType.stretched ? stateTheme.toggle.toggleBody.stretched : stateTheme.toggle.toggleBody.compact), 
                   stateTheme.toggle.toggleBody)} onClick={(e) => {
                  setIsOn(!ison);
                  if (isenabled) {
                    onClick();
                  }
                  }}>
                <div
                  style={Object.assign({}, {
                    background: ison
                      ? theme.globals.accentBackground.backgroundColor
                      : stateTheme.base.secondaryBackground.backgroundColor
                  }, stateTheme.toggle.toggleBody.handle)}
                  className={ison ? stateTheme.toggle.toggleBody.isOff : ''}
                />
              </div>
        </div>
    );
}

export { Toggle, ToggleType }