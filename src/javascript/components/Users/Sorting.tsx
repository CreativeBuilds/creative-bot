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
  ) : (
    null
  );
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
    <div className={styles.user} style={stateTheme.base.quaternaryBackground}>
      <div className={styles.image_container}>
        <img
          src={
            'https://images-sih.prd.dlivecdn.com/fit-in/50x50/filters:quality(90)/avatar/default17.png'
          }
          width={26}
          height={26}
        />
      </div>
      <div className={`${styles.toggle_wrappers} ${styles.titles}`}>
        <div
          className={styles.username}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'displayname');
          }}
        >
          USERNAME <Arrow isDesc={isDesc} toggle={toggle} type={'displayname'} />
        </div>
        <div
          className={styles.points}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'points');
          }}
        >
          POINTS <Arrow isDesc={isDesc} toggle={toggle} type={'points'} />
        </div>
        <div
          className={styles.points}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'lino');
          }}
        >
          LINO <Arrow isDesc={isDesc} toggle={toggle} type={'lino'} />
        </div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          MOD {/*<Arrow isDesc={isDesc} toggle={toggle} type={'mod'}/>*/}
        </div>
      </div>
    </div>
  );
};

export { Sorting };
