import * as React from 'react';
import { useState, useEffect } from 'react';

import { ToggleBox } from './ToggleBox';

import { MdModeEdit, MdEdit, MdDelete } from 'react-icons/md';
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
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.remove_text}>
        You're about to delete this giveaway! Are you sure you want to do that?
      </div>
      <div
        className={styles.submit}
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
    console.log('UPDATED');
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

  const pickWinner = giveaway => {
    /**
     * 1. Figure out total tickets entered
     * 2. Generate a number between 1 and max tickets
     * 3. Award that user the tickets
     */
    let totalEntries = [];
    Object.keys(giveaway.entries).forEach(entryUser => {
      let entry = giveaway.entries[entryUser];
      if (entry.alreadyPicked) return;
      for (let x = 0; x < entry.tickets; x++) {
        totalEntries.push({
          name: entry.dliveUsername,
          username: entry.username,
          tickets: entry.tickets
        });
      }
    });
    console.log(totalEntries);
    let total = totalEntries.length;
    if (total === 0) {
      throw new Error('No one has entered the giveaway');
    }
    let winningNumber = Math.floor(Math.random() * total);
    let newObj = {};
    let winner = totalEntries[winningNumber];
    if (!giveaway.winners) giveaway.winners = [winner];
    giveaway.winners.push(winner);
    delete giveaway.entries[winner.username];
    newObj[giveaway.name] = Object.assign({}, giveaway);
    let Giveaways = Object.assign({}, giveaways, newObj);
    setRxGiveaways(Giveaways);
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>{giveaway.name}</div>
        <div className={styles.points}>
          {Object.keys(giveaway.entries).length}
        </div>
        <div className={styles.points}>{getTimeLeft(giveaway)}</div>
        <div className={styles.spacer}>{giveaway.reward}</div>
        <div className={styles.modded}>
          <div
            className={`${styles.pick} ${
              Object.keys(giveaway.entries).length > 0 ? styles.no_hover : ''
            }`}
            style={{
              color: stateTheme.main.backgroundColor,
              backgroundColor:
                Object.keys(giveaway.entries).length > 0
                  ? stateTheme.main.color
                  : '#333'
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
