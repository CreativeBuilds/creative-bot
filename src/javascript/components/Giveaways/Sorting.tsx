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
    <div className={styles.user} style={stateTheme.base.quinaryBackground}>
      <div className={`${styles.toggle_wrappers} ${styles.titles}`}>
        <div
          className={styles.username}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'name');
          }}
        >
          NAME <Arrow isDesc={isDesc} toggle={toggle} type={'name'} />
        </div>
        <div
          className={styles.points}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'entries');
          }}
        >
          ENTRIES <Arrow isDesc={isDesc} toggle={toggle} type={'entries'} />
        </div>
        <div className={styles.points}>TIME LEFT</div>
        <div
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'reward');
          }}
          className={styles.spacer}
        >
          REWARD <Arrow isDesc={isDesc} toggle={toggle} type={'reward'} />
        </div>
        <div className={styles.modded}>
          PICK {/*<Arrow isDesc={isDesc} toggle={toggle} type={'mod'}/>*/}
        </div>
        <div className={styles.modded}>
          REMOVE {/*<Arrow isDesc={isDesc} toggle={toggle} type={'mod'}/>*/}
        </div>
      </div>
    </div>
  );
};

export { Sorting };
