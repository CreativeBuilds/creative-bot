import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import {
  MdHelpOutline,
  MdKeyboardArrowRight,
  MdDone,
  MdExitToApp,
  MdContentCut,
  MdContentCopy,
  MdContentPaste,
  MdDelete,
  MdSelectAll,
  MdRefresh,
  MdReplay,
  MdExtension,
  MdZoomOutMap,
  MdZoomIn,
  MdZoomOut,
  MdBrightnessLow,
  MdBrightness3,
  MdFullscreen,
  MdClose
} from 'react-icons/md';
import { GoMarkGithub, GoLink } from 'react-icons/go';
import { theme, useComponentVisible, ThemeContext } from '../../helpers';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';

import { SegmentControlItem } from './SegmentControlItem';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./SegmentControl.scss');

interface SegmentControlSource {
  id: Number;
  name: String;
  page?: Function | Element | any;
}

interface SegmentControl {
  defaultValue: String;
  source: Array<SegmentControlSource>;
  view: Element;
  Config?: {};
}

const SegmentControl = ({
  source,
  view,
  defaultValue,
  Config = {}
}: SegmentControl) => {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState<any>(source[index].page);
  const [stateTheme, setStateTheme] = useState(theme.dark);
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

  const onClick = i => {
    setIndex(i);
    setPage(source[i].page);
  };

  return (
    <div className={styles.segmentControl}>
      <div className={styles.segmentHeader} style={stateTheme.base.background}>
        {source.map(i => (
          <SegmentControlItem
            id={i.name}
            title={i.name as string}
            defaultValue={defaultValue}
            onClick={() => onClick(i.id)}
          />
        ))}
      </div>
      <div className={styles.segmentBody}>
        {<div className={styles.segmentView}>{view}</div>}
      </div>
    </div>
  );
};

export { SegmentControl, SegmentControlSource };
