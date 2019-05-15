import * as React from 'react';
import { useState } from 'react';
import { filter, first } from 'rxjs/operators';
let { setRxLists, rxLists } = require('../../helpers/rxLists');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const NamePopup = ({ list, styles, closeCurrentPopup, stateTheme }) => {
  const [name, setName] = useState<string>(list.name);
  const [permissions, setPermissions] = useState(list.permissions);

  const saveToDB = () => {
    if (name.length === 0) return;
    rxLists
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe(lists => {
        let Lists = Object.assign({}, lists);
        delete Lists[list.name];
        Lists[name] = Object.assign({}, list, {
          name
        });
        setRxLists(Lists);
      });
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Name</div>
        <textarea
          className={styles.input}
          onChange={e => {
            if (
              /^[a-zA-Z]+$/.test(e.target.value.toLowerCase()) ||
              e.target.value.length === 0
            )
              setName(e.target.value.toLowerCase());
          }}
          value={name}
        />
      </div>
      <div
        className={styles.submit}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
        }}
        onClick={() => {
          saveToDB();
          closeCurrentPopup();
        }}
      >
        SAVE
      </div>
    </div>
  );
};

export { NamePopup };
