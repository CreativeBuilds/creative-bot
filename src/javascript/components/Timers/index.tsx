import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';
const { Timer } = require('./Timer');
const { Sorting } = require('./Sorting');
let { setRxTimers } = require('../../helpers/rxTimers');

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
        <div className={styles.input_name}>Repeat Every -- Seconds</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setSeconds(e.target.value);
          }}
          value={seconds}
        />
      </div>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Min. Amount of Msgs Between</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setMessages(e.target.value);
          }}
          value={messages}
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
        CREATE
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

  console.log('ALL TIMERS', timers);

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
    <div style={stateTheme.menu} className={styles.Points}>
      <div style={stateTheme.menu.title} className={styles.header}>
        TIMERS
        <textarea
          className={styles.usersearch}
          style={stateTheme.chat.message.alternate}
          placeholder={'Search...'}
          value={searchCommandName}
          onChange={e => {
            setSearchCommandName(e.target.value);
          }}
        />
        <MdAddCircle
          className={styles.add_circle}
          onClick={() => {
            addCommandPopup();
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
