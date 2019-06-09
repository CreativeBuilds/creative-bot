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
    <div className={styles.user} style={stateTheme.base.quaternaryBackground}>
      <div className={`${styles.toggle_wrappers} ${styles.titles}`}>
        <div
          className={styles.id}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'quoteId');
          }}
        >
          ID <Arrow isDesc={isDesc} toggle={toggle} type={'quoteId'} />
        </div>
        <div
          className={styles.quote}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'quote');
          }}
        >
          QUOTE <Arrow isDesc={isDesc} toggle={toggle} type={'quote'} />
        </div>
        <div
          className={styles.quoteBy}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'quotedby');
          }}
        >
          QUOTED BY <Arrow isDesc={isDesc} toggle={toggle} type={'quotedby'} />
        </div>
        <div
          className={styles.event}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'event');
          }}
        >
          EVENT <Arrow isDesc={isDesc} toggle={toggle} type={'event'} />
        </div>
        <div
          className={styles.date}
          onClick={() => {
            swapOrToggle(isDesc, toggle, 'date');
          }}
        >
          DATE <Arrow isDesc={isDesc} toggle={toggle} type={'date'} />
        </div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          REMOVE {/*<Arrow isDesc={isDesc} toggle={toggle} type={'mod'}/>*/}
        </div>
      </div>
    </div>
  );
};

export { Sorting };