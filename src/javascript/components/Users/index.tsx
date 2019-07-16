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

import { TextField, SearchField } from '../Generics/Input';
import { MdSettings } from 'react-icons/md';
import { WidgetButton } from '../Generics/Button';
import { Panel } from '../Generics/Panel';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Users.scss');

let timeoutPoints;
let timeoutTimer;
let timeoutLemons;
let timeoutIcecream;
let timeoutDiamond;
let timeoutNinja;
let timeoutNinjet;

const SettingsPopup = ({ stateTheme, styles, Config, closeCurrentPopup }) => {
  const [pointsText, setPointsText] = useState('loading');
  const [pointsTimerText, setPointsTimerText] = useState('loading');
  const [lemonsText, setLemonsText] = useState('loading');
  const [icecreamText, setIcecreamText] = useState('loading');
  const [diamondsText, setDiamondsText] = useState('loading');
  const [ninjaText, setNinjaText] = useState('loading');
  const [ninjetText, setNinjetText] = useState('loading');

  useEffect(() => {
    let listener = firebaseConfig$
      .pipe(filter(x => !x.first))
      .subscribe((config: any) => {
        setPointsText(config.points || 5);
        setPointsTimerText(((config.pointsTimer || 300) / 60).toString());
        console.log(config.donationSettings, 'DONATION SETTINGS!');
        setLemonsText(
          Object.assign({}, { lemons: 1 }, config.donationSettings).lemons
        );
        setIcecreamText(
          Object.assign({ icecream: 10 }, config.donationSettings).icecream
        );
        setDiamondsText(
          Object.assign({ diamond: 100 }, config.donationSettings).diamond
        );
        setNinjaText(
          Object.assign({ ninja: 1000 }, config.donationSettings).ninja
        );
        setNinjetText(
          Object.assign({ ninjet: 10000 }, config.donationSettings).ninjet
        );
      });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('LEMONS TEXT UPDATED', lemonsText);
  }, [lemonsText]);

  let updatePoints = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setPointsTimerText('');
    setPointsTimerText(val);
    if (timeoutPoints) {
      clearTimeout(timeoutPoints);
    }
    timeoutPoints = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe(config => {
          let Config = Object.assign({}, config, { points: num });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updatePointsTimer = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 1) return setPointsTimerText(val);

    setPointsTimerText(val);
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
    timeoutTimer = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe(config => {
          let Config = Object.assign({}, config, { pointsTimer: num * 60 });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updateLemons = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setLemonsText(val);

    setLemonsText(val);
    if (timeoutLemons) {
      clearTimeout(timeoutLemons);
    }
    timeoutLemons = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe((config: any) => {
          let Config = Object.assign({}, config, {
            donationSettings: Object.assign({}, config.donationSettings, {
              lemons: num
            })
          });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updateIcecream = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setIcecreamText(val);

    setIcecreamText(val);
    if (timeoutIcecream) {
      clearTimeout(timeoutIcecream);
    }
    timeoutIcecream = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe((config: any) => {
          let Config = Object.assign({}, config, {
            donationSettings: Object.assign({}, config.donationSettings, {
              icecream: num
            })
          });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updateDiamond = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setDiamondsText(val);

    setDiamondsText(val);
    if (timeoutDiamond) {
      clearTimeout(timeoutDiamond);
    }
    timeoutDiamond = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe((config: any) => {
          let Config = Object.assign({}, config, {
            donationSettings: Object.assign({}, config.donationSettings, {
              diamond: num
            })
          });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updateNinja = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setNinjaText(val);

    setNinjaText(val);
    if (timeoutNinja) {
      clearTimeout(timeoutNinja);
    }
    timeoutNinja = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe((config: any) => {
          let Config = Object.assign({}, config, {
            donationSettings: Object.assign({}, config.donationSettings, {
              ninja: num
            })
          });
          setRxConfig(Config);
        });
    }, 1500);
  };

  let updateNinjet = val => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    if (num < 0) return setNinjetText(val);

    setNinjetText(val);
    if (timeoutNinjet) {
      clearTimeout(timeoutNinjet);
    }
    timeoutNinjet = setTimeout(() => {
      firebaseConfig$
        .pipe(
          filter(x => !x.first),
          first()
        )
        .subscribe((config: any) => {
          let Config = Object.assign({}, config, {
            donationSettings: Object.assign({}, config.donationSettings, {
              ninjet: num
            })
          });
          setRxConfig(Config);
        });
    }, 1500);
  };

  return (
    <div className={`${styles.popup}`}>
      <h2 style={{ marginTop: '0px' }}>User Settings</h2>
      <Panel
        header='Points'
        hasHeader={true}
        style={stateTheme.base.tertiaryBackground}
        stateTheme={stateTheme}
        content={
          <div>
            <TextField
              header={`Payout Rate in Minutes`}
              placeholderText={`Input rate...`}
              stateTheme={stateTheme}
              width={'100%'}
              text={pointsTimerText}
              inputStyle={stateTheme.base.secondaryBackground}
              onChange={e => {
                if (!isNaN(Number(e.target.value)) || e.target.value === '')
                  updatePointsTimer(e.target.value);
              }}
            />
            <TextField
              header={`Base Points Per Payout`}
              placeholderText={`Input points per payout...`}
              stateTheme={stateTheme}
              width={'100%'}
              inputStyle={stateTheme.base.secondaryBackground}
              text={pointsText}
              onChange={e => {
                if (!isNaN(Number(e.target.value)) || e.target.value === '')
                  updatePoints(e.target.value);
              }}
            />
            <i>
              Users who chat every {pointsTimerText} minute
              {parseInt(pointsTimerText) === 1 ? '' : 's'} will receive{' '}
              {pointsText} point{parseInt(pointsText) === 1 ? '' : 's'}!
            </i>
          </div>
        }
      />
      <Panel
        header='Donations'
        hasHeader={true}
        style={Object.assign(
          {},
          { marginTop: '10px' },
          stateTheme.base.tertiaryBackground
        )}
        stateTheme={stateTheme}
        content={
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TextField
                header={`Points per lemon`}
                placeholderText={`Input points per Lemon...`}
                stateTheme={stateTheme}
                width={'48%'}
                inputStyle={stateTheme.base.secondaryBackground}
                text={lemonsText}
                style={{ flex: 1, paddingRight: '5px' }}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    updateLemons(e.target.value);
                }}
              />
              <TextField
                header={`Points per Ice Cream`}
                placeholderText={`Input points per Ice Cream...`}
                stateTheme={stateTheme}
                width={'48%'}
                inputStyle={stateTheme.base.secondaryBackground}
                text={icecreamText}
                style={{ flex: 1, paddingLeft: '5px' }}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    updateIcecream(e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TextField
                header={`Points per Diamond`}
                placeholderText={`Input points per Diamond...`}
                stateTheme={stateTheme}
                width={'48%'}
                style={{ flex: 1, paddingRight: '5px' }}
                inputStyle={stateTheme.base.secondaryBackground}
                text={diamondsText}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    updateDiamond(e.target.value);
                }}
              />
              <TextField
                header={`Points per Ninjaghini`}
                width={'48%'}
                placeholderText={`Input points per Ninjaghini...`}
                stateTheme={stateTheme}
                style={{ flex: 1, paddingLeft: '5px' }}
                inputStyle={stateTheme.base.secondaryBackground}
                text={ninjaText}
                onChange={e => {
                  if (!isNaN(Number(e.target.value)) || e.target.value === '')
                    updateNinja(e.target.value);
                }}
              />
            </div>
            <TextField
              header={`Points per Ninjet`}
              placeholderText={`Input points per Ninjet...`}
              stateTheme={stateTheme}
              width={'100%'}
              inputStyle={stateTheme.base.secondaryBackground}
              text={ninjetText}
              onChange={e => {
                if (!isNaN(Number(e.target.value)) || e.target.value === '')
                  updateNinjet(e.target.value);
              }}
            />
          </div>
        }
      />
    </div>
  );
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
          <SearchField
            placeholderText={'Search...'}
            text={""}
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
