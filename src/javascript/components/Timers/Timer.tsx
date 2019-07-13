import * as React from 'react';
import { useState } from 'react';

import { Checkbox } from '../Generics/Checkbox';
import { Button, DestructiveButton, ActionButton, WidgetButton } from '../Generics/Button';
import { TextField } from '../Generics/Input';

import { theme } from '../../helpers';

import { MdModeEdit, MdEdit, MdDelete } from 'react-icons/md';
let { setRxTimers, rxTimers } = require('../../helpers/rxTimers');
import { first } from 'rxjs/operators';
import { firebaseTimers$ } from '../../helpers/rxTimers';
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
    firebaseTimers$.pipe(first()).subscribe(timers => {
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
    <div style={stateTheme.popup.dialog.content}>
      <h2>Update Timer</h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        <TextField 
          text={name}
          placeholderText={"Name"} 
          header={"Name"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setName(e.target.value);
          }}/>
        <TextField 
          text={seconds}
          placeholderText={"Seconds Repeated"} 
          header={"Repeat Every -- Seconds"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setSeconds(e.target.value);
          }}/>
        <TextField 
          text={messages}
          placeholderText={"Amount of Msgs Between"} 
          header={"Min. Amount of Msgs Between"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setMessages(e.target.value);
          }}/>
        <TextField 
          text={reply}
          placeholderText={"Reply"} 
          header={"Reply"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={Object.assign({}, {'margin-bottom': '10px'},stateTheme.base.secondaryBackground)}
          onChange={e => {
            setReply(e.target.value);
          }}/>
        <Button 
          title={"Create"} 
          isSubmit={true} 
          stateTheme={stateTheme}  
          onClick={() => {
            if (isNaN(Number(messages)) || isNaN(Number(seconds))) return;
            saveToDB();
            closeCurrentPopup();
          }} />
      </div>
    </div>
  );
};

const RemoveTimerPopup = ({ timer, styles, closeCurrentPopup, stateTheme }) => {
  let name = timer.name;

  const saveToDB = () => {
    if (name.length === 0) return;
    firebaseTimers$.pipe(first()).subscribe(timers => {
      let Timers = Object.assign({}, timers);
      delete Timers[name];
      setRxTimers(Timers);
    });
  };

  return (
    <div className={styles.popup}>
      <div className={styles.remove_text}>
        You're about to delete this command! Are you sure you want to do that?
      </div>
      <DestructiveButton 
        title={"Yes"} 
        isSubmit={true}
        stateTheme={stateTheme} 
        onClick={() => {
            saveToDB();
            closeCurrentPopup();
          }} />
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
    firebaseTimers$.pipe(first()).subscribe(Timers => {
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
        nth % 2 ? stateTheme.cell.alternate : {}
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>
          {timer.name}{' '}
          <WidgetButton 
            icon={<MdModeEdit />} 
            stateTheme={stateTheme} 
            onClick={() => {
              updateCommandPopup(timer);
            }}/>
        </div>
        <div className={styles.points}>{timer.seconds}</div>
        <div className={styles.points}>{timer.messages}</div>
        <div className={styles.spacer} />
        <div className={styles.modded}>
          {/*<ToggleBox
            styles={styles}
            timer={timer}
            stateTheme={stateTheme}
            ipcRenderer={ipcRenderer}
            editTimer={editTimer}
          />*/}
          <Checkbox isOn={timer.enabled} 
          stateTheme={stateTheme} 
          onClick={(value) => { 
            editTimer(timer.name, value);
           }} />
        </div>
        <div className={styles.modded}>
          <WidgetButton 
            icon={<MdDelete />} 
            stateTheme={stateTheme} 
            onClick={() => {
              removeTimerPopup(timer);
            }}/>
        </div>
      </div>
    </div>
  );
};

export { Timer };
