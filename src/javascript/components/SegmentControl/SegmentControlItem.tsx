import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, useComponentVisible, ThemeContext } from '../../helpers';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./SegmentControl.scss');

interface SegmentControlItem {
  id: any;
  title: string;
  defaultValue?: String;
  onClick?: () => void;
  Config?: {};
  onChange?: (e) => void;
}

const SegmentControlItem = ({
  id,
  title,
  defaultValue = null,
  onClick,
  Config = {},
  onChange = null
}: SegmentControlItem) => {
  const [stateTheme, setStateTheme] = useState(theme.dark);
  const [ischecked, setIsChecked] = useState(title === defaultValue);
  const [config, setConfig] = useState(Config);

  const changeTheme = (themeVal: String) => {
    if (themeVal == 'dark') {
      setStateTheme(theme.dark);
    } else if (themeVal == 'light') {
      setStateTheme(theme.light);
    }
  };

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      changeTheme(data.themeType);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <div
      className={styles.segmentControlItem}
      style={stateTheme.segmentControlItem}
    >
      <input
        className={styles.segmentInput}
        style={stateTheme.segmentControlItem}
        type='radio'
        name='sc-1-1'
        id={id}
        defaultChecked={title === defaultValue}
      />
      <label
        className={styles.segmentLabel}
        style={stateTheme.segmentControlItem}
        htmlFor={id}
        data-value={title}
        onClick={() => {
          onClick();
        }}
      >
        {title}
      </label>
    </div>
  );
};

export { SegmentControlItem };
