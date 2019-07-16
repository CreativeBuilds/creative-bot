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

import { Button, DestructiveButton, ActionButton, WidgetButton } from '../Generics/Button';
import { TextField, SearchField } from '../Generics/Input';
import { Page, PageHeader, PageBody } from '../Generics/Common';

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
    <div style={stateTheme.popup.dialog.content}>
      <h2>Add Giveaway</h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        <TextField 
          text={name}
          placeholderText={"Reply"} 
          header={
            <div>
              Name -{' '}
              <span style={{ fontSize: '0.68em' }}>
                If name is test then a user doing <br />
                !test numberOfTickets will purchase those tickets
              </span>
            </div>
          }
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            let val = e.target.value;
            val = val.replace(' ', '-').replace('--', '-');
            setName(val);
          }}/>
        <TextField 
          text={reward}
          placeholderText={"Reward"} 
          header={"Reward"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setReward(e.target.value);
          }}/>
        <TextField 
          text={String(cost)}
          placeholderText={"Cost"} 
          header={"Cost (Default: No Cost)"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
             if (isNaN(Number(e.target.value))) return;
            setCost(Math.abs(Number(e.target.value)));
          }}/>
        <TextField 
          text={String(maxEntries)}
          placeholderText={"Max Entries"} 
          header={
          <div>
            Max Entries <br /> (0 - no max)
          </div>
          }
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            if (isNaN(Number(e.target.value))) return;
            setMaxEntries(Math.abs(Number(e.target.value)));
          }}/>
        <TextField 
          text={String(secondsUntilClose)}
          placeholderText={"Seconds Until Close"} 
          header={
          <div>
            Seconds Until Close <br /> (0 - doesn't close)
          </div>
          }
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            if (isNaN(Number(e.target.value))) return;
            setSecondsUntilClose(Math.abs(Number(e.target.value)));
          }}/>
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
    <Page stateTheme={stateTheme} style={stateTheme.base.tertiaryBackground}>
      <PageHeader
        style={stateTheme.base.quinaryForeground}
        stateTheme={stateTheme}>
        GIVEAWAYS
        <WidgetButton 
          icon={<MdAddCircle />} 
          style={stateTheme.button.widget.add}
          stateTheme={stateTheme} 
          onClick={() => {
            addGiveawayPopup();
          }}/>
        <SearchField
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
      </PageHeader>
      <PageBody stateTheme={stateTheme}>
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
      </PageBody>
    </Page>
  );
};

export { GiveawaysPage };
