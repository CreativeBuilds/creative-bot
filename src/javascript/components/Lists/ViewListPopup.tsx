import * as React from 'react';
import { useState, useEffect } from 'react';
import { filter, first } from 'rxjs/operators';
let { setRxLists, rxLists } = require('../../helpers/rxLists');
import { MdAddCircle, MdRemove, MdClose } from 'react-icons/md';

import styles from './ViewListPopup.scss';
import listStyle from './Lists.scss';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const NewListElement = ({ closeCurrentPopup, stateTheme, list }) => {
  const [value, setValue] = useState('');

  const submit = () => {
    rxLists.pipe(first()).subscribe(lists => {
      if (!lists[list.name]) return closeCurrentPopup();
      lists[list.name].values.push({ value, dateAdded: Date.now() });
      setRxLists(lists);
      closeCurrentPopup();
    });
  };

  return (
    <div className={styles.popup}>
      <h1>NEW ITEM</h1>
      <div
        className={listStyle.input_wrapper}
        style={{ width: '75%', margin: 'auto' }}
      >
        <div className={listStyle.input_name}>Name</div>
        <input
          className={listStyle.input}
          onChange={e => {
            setValue(e.target.value);
          }}
          value={value}
        />
        <div
          className={styles.button}
          style={stateTheme.submitButton}
          onClick={() => {
            submit();
          }}
        >
          ADD ITEM
        </div>
      </div>
    </div>
  );
};

const ViewListPopup = props => {
  const {
    justName,
    styles,
    closeCurrentPopup,
    stateTheme,
    addPopup,
    lists: Lists,
    list: List
  } = props;

  const [lists, setLists] = useState(Lists);
  const [list, setList] = useState(List);
  const [name, setName] = useState<string>(list.name);
  const [reply, setReply] = useState<string>(list.reply);
  const [uses, setUses] = useState<number>(list.uses);
  const [search, setSearch] = useState<string>('');
  const [permissions, setPermissions] = useState(list.permissions);

  useEffect(() => {
    let listener = rxLists.subscribe(Lists => {
      setLists(Lists);
      setList(Lists[list.name]);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = () => {
    if (name.length === 0) return;
    ipcRenderer.send('editlist', {
      oldName: list.name,
      name,
      obj: {
        reply,
        name,
        uses,
        permissions,
        enabled: list.enabled
      }
    });
  };

  const removeItem = value => {
    let Values = list.values.reduce((acc, curr) => {
      if (curr.dateAdded === value.dateAdded && curr.value === value.value)
        return acc;
      acc.push(curr);
      return acc;
    }, []);
    rxLists.pipe(first()).subscribe(lists => {
      lists[list.name] = Object.assign({}, list, { values: Values });
      setRxLists(lists);
    });
    console.log('new list', Values, 'oldList', list.values, list);
  };

  return (
    <div
      className={styles.popup}
      style={Object.assign({}, stateTheme.main, { position: 'relative' })}
    >
      <div className={styles.popup_add_item}>
        <MdAddCircle
          className={styles.add_circle}
          style={{ top: 0, left: 0 }}
          onClick={() => {
            console.log('Wowza');
            // addListPopup();
            addPopup(
              <NewListElement
                closeCurrentPopup={closeCurrentPopup}
                stateTheme={stateTheme}
                list={list}
              />
            );
          }}
        />
      </div>
      <h1>{list.name}</h1>
      <div className={styles.popup_search_wrapper}>
        <textarea
          placeholder={'Search...'}
          className={styles.popup_search}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
          style={stateTheme.searchInput}
        />
      </div>
      <div className={styles.popup_list_header}>
        Items <hr />
      </div>
      <div className={styles.popup_list}>
        {list.values
          .reduce((acc, curr) => {
            if (search.length > 0) {
              if (curr.value.toLowerCase().includes(search.toLowerCase())) {
                acc.push(curr);
              }
            } else {
              acc.push(curr);
            }
            return acc;
          }, [])
          .map((value, nth) => {
            return (
              <div
                className={styles.popup_list_item}
                style={Object.assign(
                  {},
                  stateTheme.cell.normal,
                  nth % 2 ? stateTheme.cell.alternate : { }
                )}
              >
                {value.value || 'Test string'}
                <MdClose
                  className={styles.delete_item}
                  onClick={() => {
                    removeItem(value);
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { ViewListPopup };
