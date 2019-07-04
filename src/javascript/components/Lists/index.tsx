import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';
const { List } = require('./List');
const { Sorting } = require('./Sorting');
let { setRxLists } = require('../../helpers/rxLists');
import { AddListPopup } from './AddListPopup';

import { TextField } from '../Generics/Input';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Lists.scss');

const ListsPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('name');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchListName, setSearchListName] = useState<string>('');
  const { lists, addPopup, closeCurrentPopup } = props;

  let listArray = _.orderBy(
    _.sortBy(Object.keys(lists))
      .map(name => lists[name])
      .filter(list => {
        if (searchListName.trim() === '') return true;
        return list.name
          .toLowerCase()
          .includes(searchListName.trim().toLowerCase());
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );

  const addListPopup = () => {
    addPopup(
      <AddListPopup
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        lists={lists}
      />
    );
  };

  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Points}>
      <div style={Object.assign({}, stateTheme.toolBar, stateTheme.base.quinaryForeground)} className={styles.header}>
        LISTS
        <TextField 
          placeholderText={"Search..."} 
          stateTheme={stateTheme} 
          width={'150px'}
          style={{
            right: '10px',
            'overflow-y': 'hidden',
            'overflow-x': 'auto',
            position: 'absolute',
          }}
          inputStyle={stateTheme.base.secondaryBackground}
          onChange={e => {
            setSearchListName(e.target.value);
          }}/>
        <MdAddCircle
          className={styles.add_circle}
          onClick={() => {
            addListPopup();
          }}
        />
      </div>
      <div style={{}} className={styles.content}>
        {/* TODO ADD PAGINATION */}
        <Sorting
          toggle={toggle}
          setToggle={setToggle}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          styles={styles}
          stateTheme={stateTheme}
        />
        {listArray.map((list, nth) => {
          return (
            <List
              styles={styles}
              list={list}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
              lists={lists}
            />
          );
        })}
      </div>
    </div>
  );
};

export { ListsPage };
