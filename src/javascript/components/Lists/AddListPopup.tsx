import * as React from 'react';
import { useState } from 'react';
let { setRxLists } = require('../../helpers/rxLists');

const AddListPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  lists = {}
}) => {
  const [name, setName] = useState<string>('');
  const [permissions, setPermissions] = useState({});

  const saveToDB = () => {
    if (name.length === 0) return;
    let Lists = Object.assign({}, lists);
    Lists[name] = {
      name,
      permissions,
      values: [],
      enabled: true
    };
    setRxLists(Lists);
  };

  const save = () => {
    saveToDB();
    closeCurrentPopup();
  };

  return (
    <div className={styles.popup}>
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
        onClick={save}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
        }}
      >
        CREATE
      </div>
    </div>
  );
};

export { AddListPopup };
