import * as React from 'react';
import { useState } from 'react';

import { ToggleBox } from './ToggleBox';

import { theme } from '../../helpers';

import { MdModeEdit, MdEdit, MdDelete } from 'react-icons/md';
let { setRxTimers, rxTimers } = require('../../helpers/rxTimers');
import { first } from 'rxjs/operators';
const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ command, styles, closeCurrentPopup, stateTheme }) => {
  const [name, setName] = useState<string>(command.name);
  const [reply, setReply] = useState<string>(command.reply);
  const [messages, setMessages] = useState(command.messages);
  const [seconds, setSeconds] = useState(command.seconds);
  const [permissions, setPermissions] = useState(command.permissions);

  const saveToDB = () => {
    if (name.length === 0) return;
    rxTimers.pipe(first()).subscribe(timers => {
      let Timers = Object.assign({}, timers);
      if (command.name !== name) {
        delete Timers[name];
      }
      if (isNaN(Number(messages)) || isNaN(Number(seconds))) return;
      Timers[name] = {
        reply,
        name,
        permissions,
        messages: Number(messages),
        seconds: Number(seconds),
        enabled: command.enabled
      };
      setRxTimers(Timers);
    });

    // if (name.length === 0) return;
    // ipcRenderer.send('editcommand', {
    //   oldName: command.name,
    //   name,
    //   obj: {
    //     reply,
    //     name,
    //     uses,
    //     permissions,
    //     enabled: command.enabled
    //   }
    // });
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Name</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setName(e.target.value);
          }}
          value={name}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Reply</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setReply(e.target.value);
          }}
          value={reply}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Repeat Every -- Seconds</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setSeconds(Number(e.target.value));
          }}
          value={seconds}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Min. Amount of Msgs Between</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setMessages(Number(e.target.value));
          }}
          value={messages}
        />
      </div>
      <div
        className={styles.submit}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
        }}
        onClick={() => {
          if (isNaN(Number(messages)) || isNaN(Number(seconds))) return;
          saveToDB();
          closeCurrentPopup();
        }}
      >
        SAVE
      </div>
    </div>
  );
};

const RemoveTimerPopup = ({ timer, styles, closeCurrentPopup, stateTheme }) => {
  let name = timer.name;

  const saveToDB = () => {
    if (name.length === 0) return;
    rxTimers.pipe(first()).subscribe(timers => {
      let Timers = Object.assign({}, timers);
      delete Timers[name];
      setRxTimers(Timers);
    });
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.remove_text}>
        You're about to delete this command! Are you sure you want to do that?
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

const Timer = ({
  styles,
  timer,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup
}) => {
  const updateCommandPopup = command => {
    addPopup(
      <Popup
        command={command}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
      />
    );
  };

  const removeTimerPopup = timer => {
    addPopup(
      <RemoveTimerPopup
        timer={timer}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
      />
    );
  };

  const editTimer = (name, enabled) => {
    rxTimers.pipe(first()).subscribe(Timers => {
      let timer = Object.assign({}, Timers[name]);
      timer.enabled = enabled;
      let obj = {};
      obj[name] = timer;
      let timers = Object.assign({}, Timers, obj);
      setRxTimers(timers);
    });
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
          {timer.name}{' '}
          <MdEdit
            onClick={() => {
              updateCommandPopup(timer);
            }}
          />
        </div>
        <div className={styles.points}>{timer.seconds}</div>
        <div className={styles.points}>{timer.messages}</div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          <ToggleBox
            styles={styles}
            timer={timer}
            stateTheme={stateTheme}
            ipcRenderer={ipcRenderer}
            editTimer={editTimer}
          />
        </div>
        <div className={styles.modded}>
          <MdDelete
            className={styles.trash}
            onClick={() => {
              removeTimerPopup(timer);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Timer };
