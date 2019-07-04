import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';
import { firebaseGiveaways$ } from '../../helpers/rxGiveaways';
import { first } from 'rxjs/operators';
const { Giveaway } = require('./Giveaway');
const { Sorting } = require('./Sorting');
let { setRxGiveaways } = require('../../helpers/rxGiveaways');

import { Button, DestructiveButton, ActionButton } from '../Generics/Button';
import { TextField } from '../Generics/Input';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Giveaways.scss');
const AddGiveawayPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  giveaways = {}
}) => {
  const [name, setName] = useState<string>('');
  const [reward, setReward] = useState<string>('');
  const [entries, setEntries] = useState({});
  const [cost, setCost] = useState<number>(0);
  const [maxEntries, setMaxEntries] = useState<number>(0);
  // May want max entries
  // PERMISSIONS WILL NEED TO BE A SUB ONLY FEATURE / DOESNT HAVE A USE RN
  const [permissions, setPermissions] = useState({});
  const [secondsUntilClose, setSecondsUntilClose] = useState<number>(0);

  const saveToDB = () => {
    if (name.length === 0) return;
    firebaseGiveaways$.pipe(first()).subscribe(giveaways => {
      let Giveaways = Object.assign({}, giveaways);
      Giveaways[name] = {
        reward,
        name,
        entries,
        maxEntries,
        permissions,
        cost,
        secondsUntilClose,
        createdAt: Date.now(),
        enabled: true
      };
      setRxGiveaways(Giveaways);
    });
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>
          Name -{' '}
          <span style={{ fontSize: '0.68em' }}>
            If name is test then a user doing <br />
            !test numberOfTickets will purchase those tickets
          </span>
        </div>
        <textarea
          className={styles.input}
          onChange={e => {
            let val = e.target.value;
            val = val.replace(' ', '-').replace('--', '-');
            setName(val);
          }}
          value={name}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Reward</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setReward(e.target.value);
          }}
          value={reward}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Cost (Default: No Cost)</div>
        <textarea
          className={styles.input}
          onChange={e => {
            if (isNaN(Number(e.target.value))) return;
            setCost(Math.abs(Number(e.target.value)));
          }}
          value={cost}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>
          Max Entries <br /> (0 - no max)
        </div>
        <textarea
          className={styles.input}
          onChange={e => {
            if (isNaN(Number(e.target.value))) return;
            setMaxEntries(Math.abs(Number(e.target.value)));
          }}
          value={maxEntries}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>
          Seconds Until Close <br /> (0 - doesn't close)
        </div>
        <textarea
          className={styles.input}
          onChange={e => {
            if (isNaN(Number(e.target.value))) return;
            setSecondsUntilClose(Math.abs(Number(e.target.value)));
          }}
          value={secondsUntilClose}
        />
      </div>
      <Button 
        title={"Create"} 
        isSubmit={true} 
        stateTheme={stateTheme}  
        onClick={() => {
          // if (isNaN(Number(uses))) return;
          // setUses(Number(uses));
          saveToDB();
          closeCurrentPopup();
        }} />
    </div>
  );
};

const GiveawaysPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('points');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchGiveawayName, setSearchGiveawayName] = useState<string>('');
  const { giveaways, addPopup, closeCurrentPopup } = props;

  let giveawayArray = _.orderBy(
    _.sortBy(Object.keys(giveaways))
      .map(name => giveaways[name])
      .filter(giveaway => {
        if (searchGiveawayName.trim() === '') return true;
        return giveaway.name
          .toLowerCase()
          .includes(searchGiveawayName.trim().toLowerCase());
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );

  const addGiveawayPopup = () => {
    addPopup(
      <AddGiveawayPopup
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        giveaways={giveaways}
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
        GIVEAWAYS
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
            setSearchGiveawayName(e.target.value);
          }}/>
        <MdAddCircle
          className={styles.add_circle}
          onClick={() => {
            addGiveawayPopup();
          }}
        />
      </div>
      <div style={{}} className={styles.content}>
        <Sorting
          toggle={toggle}
          setToggle={setToggle}
          isDesc={isDesc}
          setIsDesc={setIsDesc}
          styles={styles}
          stateTheme={stateTheme}
        />
        {giveawayArray.map((giveaway, nth) => {
          return (
            <Giveaway
              styles={styles}
              giveaway={giveaway}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
              giveaways={giveaways}
            />
          );
        })}
      </div>
    </div>
  );
};

export { GiveawaysPage };
