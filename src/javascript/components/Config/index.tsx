import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';

const { Config } = require('./Config');
const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Config.scss');

const whitelist = {
  authKey: {
    name: 'Auth Key',
    hidden: true
  },
  points: {
    name: 'Points',
    type: 'number'
  },
  pointsTimer: {
    name: 'Payout Interval',
    type: 'number'
  },
  streamerDisplayName: {
    name: 'Streamer Name'
  }
};

const ConfigPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('name');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchUsername, setSearchUsername] = useState<string>('');
  const { config, addPopup, closeCurrentPopup } = props;

  let configArray = _.orderBy(
    _.sortBy(Object.keys(config))
      .map(key => {
        if (!whitelist[key]) return false;
        return {
          name: whitelist[key].name,
          value: config[key],
          hidden: !!whitelist[key].hidden,
          key: key,
          type: whitelist[key].type
        };
      })
      .filter(obj => {
        if (obj) return true;
        return false;
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );
  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Points}>
      <div style={Object.assign({}, stateTheme.toolBar, stateTheme.base.quinaryForeground)} className={styles.header}>
        CONFIG
        <textarea
          className={styles.usersearch}
          style={stateTheme.searchInput}
          placeholder={'Search...'}
          value={searchUsername}
          onChange={e => {
            setSearchUsername(e.target.value);
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
        {configArray.map((option, nth) => {
          return (
            <Config
              styles={styles}
              configOption={option}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
              config={config}
            />
          );
        })}
      </div>
    </div>
  );
};

export { ConfigPage };
