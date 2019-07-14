import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { filter, distinctUntilChanged, first } from 'rxjs/operators';
import { isEmpty, isEqual } from 'lodash';

const { User } = require('./User');
const { Sorting } = require('./Sorting');

import { TextField } from '../Generics/Input';
import { MdSettings } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Users.scss');

const SettingsPopup = ({ stateTheme, styles, Config, closeCurrentPopup }) => {
  return <div>Speggat</div>;
};

const UsersPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('points');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [config, setConfig]: any = useState({});
  const [searchUsername, setSearchUsername] = useState<string>('');
  const { Users, addPopup, closeCurrentPopup } = props;

  useEffect(() => {
    let listener = firebaseConfig$
      .pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)))
      .subscribe((data: any) => {
        delete data.first;
        setConfig(data);
      });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  let userArray = _.orderBy(
    _.sortBy(Object.keys(Users))
      .map(username => Users[username])
      .filter(user => {
        if (searchUsername.trim() === '') return true;
        return user.dliveUsername
          .toLowerCase()
          .includes(searchUsername.trim().toLowerCase());
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );

  const openSettingsPanel = () => {
    addPopup(
      <SettingsPopup
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        closeCurrentPopup={closeCurrentPopup}
      />
    );
  };

  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Points}>
      <div
        style={Object.assign(
          {},
          stateTheme.toolBar,
          stateTheme.base.quinaryForeground
        )}
        className={styles.header}
      >
        USERS
        <div
          style={{
            right: '10px',
            position: 'absolute',
            display: 'flex'
          }}
        >
          <TextField
            placeholderText={'Search...'}
            stateTheme={stateTheme}
            width={'150px'}
            style={{ 'overflow-y': 'hidden', 'overflow-x': 'auto' }}
            inputStyle={stateTheme.base.secondaryBackground}
            onChange={e => {
              setSearchUsername(e.target.value);
            }}
          />
          <div
            className={styles.events}
            onClick={() => {
              openSettingsPanel();
            }}
          >
            <MdSettings />
          </div>
        </div>
      </div>
      <div style={{ overflow: 'hidden' }} className={styles.content}>
        {/* TODO ADD PAGINATION */}
        <Sorting
          toggle={toggle}
          setToggle={setToggle}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          styles={styles}
          stateTheme={stateTheme}
        />
        <AutoSizer>
          {something => {
            let { width, height } = something;
            return (
              <List
                height={height - 50}
                width={width}
                rowHeight={45}
                rowCount={userArray.length}
                rowRenderer={({ index, key, style }) => {
                  let user = userArray[index];
                  return (
                    <User
                      styles={styles}
                      style={style}
                      User={user}
                      key={key}
                      stateTheme={stateTheme}
                      nth={index + 1}
                      addPopup={addPopup}
                      closeCurrentPopup={closeCurrentPopup}
                    />
                  );
                }}
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};

export { UsersPage };
