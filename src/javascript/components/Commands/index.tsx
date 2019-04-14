import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';

const { Command } = require('./Command');
const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Commands.scss');

const AddCommandPopup = ({ styles, closeCurrentPopup, stateTheme }) => {
  const [name, setName] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [uses, setUses] = useState<number>(0);
  const [permissions, setPermissions] = useState({});

  const saveToDB = () => {
    if (name.length === 0) return;
    ipcRenderer.send('editcommand', {
      name,
      obj: {
        reply,
        name,
        uses,
        permissions,
        enabled: true
      }
    });
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
      <div
        className={styles.submit}
        onClick={() => {
          if (isNaN(Number(uses))) return;
          setUses(Number(uses));
          saveToDB();
          closeCurrentPopup();
        }}
      >
        CREATE
      </div>
    </div>
  );
};

const CommandsPage = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [toggle, setToggle] = useState<string>('points');
  const [isDesc, setIsDesc] = useState<boolean>(true);
  const [searchCommandName, setSearchCommandName] = useState<string>('');
  const { commands, addPopup, closeCurrentPopup } = props;

  let commandArray = _.orderBy(
    _.sortBy(Object.keys(commands))
      .map(name => commands[name])
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
      />
    );
  };

  return (
    <div style={stateTheme.menu} className={styles.Points}>
      <div style={stateTheme.menu.title} className={styles.header}>
        COMMANDS
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
        {commandArray.map((command, nth) => {
          return (
            <Command
              styles={styles}
              command={command}
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

export { CommandsPage };
