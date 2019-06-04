import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdHelpOutline, MdKeyboardArrowRight, MdDone, MdExitToApp, MdContentCut, MdContentCopy, MdContentPaste, MdDelete, MdSelectAll, MdRefresh, MdReplay, MdExtension, MdZoomOutMap, MdZoomIn, MdZoomOut, MdBrightnessLow, MdBrightness3, MdFullscreen, MdClose  } from 'react-icons/md';
import { GoMarkGithub, GoLink } from 'react-icons/go';
import { theme, useComponentVisible, ThemeContext } from '../../helpers';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./SegmentControl.scss');

interface SegmentControlItem {
    id: any,
    title: String,
    defaultValue?: String,
    onClick?: () => void,
    Config?: {}
}

const SegmentControlItem = ({ id, title, defaultValue = null, onClick, Config = {} } : SegmentControlItem) => {

    const [stateTheme, setStateTheme] = useState(theme.dark);
    const [config, setConfig] = useState(Config);
  
    const changeTheme = (themeVal : String) => {
      if (themeVal == 'dark') {
        setStateTheme(theme.dark); 
      } else if (themeVal == 'light') {
        setStateTheme(theme.light);
      }
    }
  
    useEffect(() => {
      let listener = rxConfig.subscribe((data: any) => {
        delete data.first;
        setConfig(data);
        changeTheme(data.themeType);
      });
      return () => {
        listener.unsubscribe();
      };
    }, []);

    return (
        <div className={styles.segmentControlItem} style={stateTheme.segmentControlItem}>
            <input className={styles.segmentInput} style={stateTheme.segmentControlItem} type="radio" name="sc-1-1" id={id} defaultChecked={title === defaultValue}></input>
            <label className={styles.segmentLabel} style={stateTheme.segmentControlItem} htmlFor={id} data-value={title} onClick={() => onClick()}>{title}</label>
        </div>
    );
}

export { SegmentControlItem }