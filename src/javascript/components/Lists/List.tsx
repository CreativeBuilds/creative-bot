import * as React from 'react';
import { useState } from 'react';

import { MdModeEdit, MdEdit, MdDelete, MdRemoveRedEye } from 'react-icons/md';
let { setRxLists } = require('../../helpers/rxLists');
import { NamePopup } from './NamePopup';
import { ViewListPopup } from './ViewListPopup';
import { RemoveListPopup } from './RemoveListPopup';

import { WidgetButton } from '../Generics/Button';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const List = ({
  styles,
  list,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup,
  lists
}) => {
  const updateListPopup = list => {
    addPopup(
      <ViewListPopup
        justName={false}
        list={list}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        addPopup={addPopup}
        lists={lists}
      />
    );
  };

  const updateNamePopup = list => {
    addPopup(
      <NamePopup
        list={list}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
      />
    );
  };

  const removeListPopup = list => {
    addPopup(
      <RemoveListPopup
        list={list}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        lists={lists}
      />
    );
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.cell.normal,
        nth % 2 ? stateTheme.cell.alternate : { }
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>
          {list.name}{' '}
          <MdEdit
            onClick={() => {
              updateNamePopup(list);
            }}
          />
          <WidgetButton 
            icon={<MdModeEdit />} 
            stateTheme={stateTheme} 
            onClick={() => {
              updateNamePopup(list);
            }}/>
        </div>
        <div className={styles.points}>{list.values.length}</div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          <MdRemoveRedEye
            style={{ strokeWidth: '0px' }}
            onClick={() => {
              updateListPopup(list);
            }}
          />
          <WidgetButton 
            icon={<MdRemoveRedEye />} 
            stateTheme={stateTheme} 
            onClick={() => {
              updateListPopup(list);
            }}/>
        </div>
        <div className={styles.modded}>
          <WidgetButton 
            icon={<MdDelete />} 
            stateTheme={stateTheme} 
            onClick={() => {
              removeListPopup(list);
            }}/>
        </div>
      </div>
    </div>
  );
};

export { List };
