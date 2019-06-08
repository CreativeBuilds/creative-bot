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
        <div className={`${styles.toggle} ${type == ToggleType.stretched ? styles.stretched : styles.compact} ${!isenabled ? styles.disabled : null} `}>
              <div className={styles.header}>{header}</div>
              <div style={stateTheme.menu} onClick={(e) => {
                  setIsOn(!ison);
                  if (isenabled) {
                    onClick();
                  }
                  }}>
                <div
                  style={{
                    background: ison
                      ? theme.globals.accentBackground.backgroundColor
                      : stateTheme.chat.message.alternate.backgroundColor
                  }}
                  className={ison ? styles.isOn : ''}
                />
              </div>
        </div>
    );
}

export { Toggle, ToggleType }