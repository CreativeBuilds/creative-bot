import * as React from 'react';
import { useState, useEffect } from 'react';

import { ToggleBox } from './ToggleBox';

import { MdModeEdit, MdEdit, MdDelete } from 'react-icons/md';
import { theme } from '../../helpers';
import { firebaseGiveaways$ } from '../../helpers/rxGiveaways';
import { first } from 'rxjs/operators';
let { setRxGiveaways } = require('../../helpers/rxGiveaways');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');
const RemoveGiveawayPopup = ({
  giveaway,
  styles,
  closeCurrentPopup,
  stateTheme,
  giveaways
}) => {
  let name = giveaway.name;

  const saveToDB = () => {
    if (name.length === 0) return;
    let Giveaways = Object.assign({}, giveaways);
    delete Giveaways[name];
    setRxGiveaways(Giveaways);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.remove_text}>
        You're about to delete this giveaway! Are you sure you want to do that?
      </div>
      <div
        className={styles.submit}
        style={theme.globals.destructiveButton}
        onClick={() => {
          saveToDB();
          closeCurrentPopup();
        }}
      >
        YES
      </div>
    </div>
  );
};

const Giveaway = ({
  styles,
  giveaway,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup,
  giveaways
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  }, []);

  const removeGiveawayPopup = giveaway => {
    addPopup(
      <RemoveGiveawayPopup
        giveaway={giveaway}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        giveaways={giveaways}
      />
    );
  };

  const getTimeLeft = giveaway => {
    if (giveaway.secondsUntilClose === 0) return 'N/A';
    if (Date.now() > giveaway.createdAt + giveaway.secondsUntilClose * 1000)
      return 0;
    return (
      Math.floor(
        (giveaway.createdAt + giveaway.secondsUntilClose * 1000 - Date.now()) /
          1000
      ) + 's'
    );
  };

  const pickWinner = Giveaway => {
    /**
     * 1. Figure out total tickets entered
     * 2. Generate a number between 1 and max tickets
     * 3. Award that user the tickets
     */
    let totalEntries = [];
    let giveaway = Object.assign({}, Giveaway);
    Object.keys(giveaway.entries).forEach(entryUser => {
      let entry = giveaway.entries[entryUser];
      if (entry.alreadyPicked) return;
      for (let x = 0; x < entry.tickets; x++) {
        totalEntries.push({
          name: entry.displayname,
          username: entry.username,
          tickets: entry.tickets
        });
      }
    });
    let total = totalEntries.length;
    if (total === 0) {
      throw new Error('No one has entered the giveaway');
    }
    let winningNumber = Math.floor(Math.random() * total);
    let newObj = {};
    let winner = totalEntries[winningNumber];
    if (!giveaway.winners) giveaway.winners = [];
    let winningArr = [].concat(giveaway.winners);
    winningArr.push(winner);
    giveaway.winners = [].concat(winningArr);
    delete giveaway.entries[winner.username];
    newObj[giveaway.name] = Object.assign({}, giveaway);
    firebaseGiveaways$.pipe(first()).subscribe(giveaways => {
      let Giveaways = Object.assign({}, giveaways, newObj);
      setRxGiveaways(Giveaways);
    });
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.cell.normal,
        nth % 2 ? stateTheme.cell.alternate : {}
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>{giveaway.name}</div>
        <div className={styles.points}>
          {Object.keys(giveaway.entries).length}
        </div>
        <div className={styles.points}>{getTimeLeft(giveaway)}</div>
        <div className={styles.points}>
          <div
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'block'
            }}
          >
            {giveaway.reward}
          </div>
        </div>
        <div className={styles.spacer}>
          {giveaway.winners
            ? giveaway.winners[giveaway.winners.length - 1]
              ? giveaway.winners[giveaway.winners.length - 1].name
              : 'N/A'
            : 'N/A'}
        </div>
        <div className={styles.modded}>
          <div
            className={`${styles.pick} ${
              Object.keys(giveaway.entries).length > 0 ? '' : styles.no_hover
            }`}
            style={{
              color: stateTheme.base.quaternaryForeground.color,
              backgroundColor:
                stateTheme.base.quaternaryBackground.backgroundColor,
              opacity: Object.keys(giveaway.entries).length > 0 ? 1.0 : 0.25
            }}
            onClick={() => {
              pickWinner(giveaway);
            }}
          >
            PICK
          </div>
        </div>
        <div className={styles.modded}>
          <MdDelete
            className={styles.trash}
            onClick={() => {
              removeGiveawayPopup(giveaway);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Giveaway };
