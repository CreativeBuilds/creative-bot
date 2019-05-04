import * as React from 'react';
import { useState } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

const Arrow = ({ isDesc, toggle, type }) => {
  return type === toggle ? (
    isDesc ? (
      <MdKeyboardArrowUp />
    ) : (
      <MdKeyboardArrowDown />
    )
  ) : null;
};

const Sorting = ({
  styles,
  stateTheme,
  toggle,
  setToggle,
  isDesc,
  setIsDesc
}) => {
  const swapOrToggle = (isDesc, toggle, type) => {
    if (toggle === type) {
      setIsDesc(!isDesc);
    } else {
      setToggle(type);
      setIsDesc(true);
    }
  };

  return (
    <div className={styles.user} style={stateTheme.chat.message}>
      <div className={`${styles.toggle_wrappers} ${styles.titles}`}>
        <div
          className={styles.username}
          onClick={() => {
            // swapOrToggle(isDesc, toggle, 'name');
          }}
        >
          NAME
        </div>
        <div className={styles.value}>VALUE</div>
        <div className={styles.edit}>EDIT</div>
      </div>
    </div>
  );
};

export { Sorting };
