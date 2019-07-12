import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';
const { Timer } = require('./Timer');
const { Sorting } = require('./Sorting');
let { setRxTimers } = require('../../helpers/rxTimers');

import { Button, DestructiveButton, ActionButton, WidgetButton } from '../Generics/Button';
import { TextField } from '../Generics/Input';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Timers.scss');
const AddCommandPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  timers = {}
}) => {
  const [name, setName] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('600');
  const [messages, setMessages] = useState<string>('5');
  const [permissions, setPermissions] = useState({});

  const saveToDB = () => {
    if (name.length === 0) return;
    let Timers = Object.assign({}, timers);
    if (isNaN(Number(messages)) || isNaN(Number(seconds))) return;
    Timers[name] = {
      reply,
      name,
      permissions,
      messages: Number(messages),
      seconds: Number(seconds),
      enabled: true
    };
    setRxTimers(Timers);
  };

  return (
    <div style={stateTheme.popup.dialog.content}>
      <h2>Add Timer</h2>
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

const TimersPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('points');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchCommandName, setSearchCommandName] = useState<string>('');
  const { timers, addPopup, closeCurrentPopup } = props;

  let commandArray = _.orderBy(
    _.sortBy(Object.keys(timers))
      .map(name => timers[name])
      .filter(command => {
        if (searchCommandName.trim() === '') return true;
        return command.name
          .toLowerCase()
          .includes(searchCommandName.trim().toLowerCase());
      }),
    [toggle],
    [isDesc ? 'desc' : 'asc']
  );

  const addCommandPopup = () => {
    addPopup(
      <AddCommandPopup
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        timers={timers}
      />
    );
  };

  return (
    <div style={stateTheme.base.tertiaryBackground} className={styles.Points}>
      <div style={Object.assign({}, stateTheme.toolBar, stateTheme.base.quinaryForeground)} className={styles.header}>
        TIMERS
        <WidgetButton 
          icon={<MdAddCircle />} 
          style={stateTheme.button.widget.add}
          stateTheme={stateTheme} 
          onClick={() => {
            addCommandPopup();
          }}/>
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
            setSearchCommandName(e.target.value);
          }}/>
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
        {commandArray.map((timer, nth) => {
          return (
            <Timer
              styles={styles}
              timer={timer}
              stateTheme={stateTheme}
              nth={nth + 1}
              addPopup={addPopup}
              closeCurrentPopup={closeCurrentPopup}
            />
          );
        })}
      </div>
    </div>
  );
};

export { TimersPage };
