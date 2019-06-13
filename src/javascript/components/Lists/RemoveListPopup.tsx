import * as React from 'react';
import { useState } from 'react';
import { filter, first } from 'rxjs/operators';
import { theme } from '../../helpers';
let { setRxLists, rxLists } = require('../../helpers/rxLists');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const RemoveListPopup = ({
  list,
  styles,
  closeCurrentPopup,
  stateTheme,
  lists
}) => {
  let name = list.name;

  const saveToDB = () => {
    if (name.length === 0) return;
    let Lists = Object.assign({}, lists);
    delete Lists[name];
    setRxLists(Lists);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.remove_text}>
        You're about to delete this list! Are you sure you want to do that?
      </div>
      <div
        className={styles.submit}
        style={theme.globals.destructiveButton}
        onClick={() => {
          saveToDB();
          closeCurrentPopup();
        }}
      >
        YES
      </div>
    </div>
  );
};

export { RemoveListPopup };
