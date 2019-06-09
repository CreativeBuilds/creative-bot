import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import * as _ from 'lodash';
import { MdAddCircle } from 'react-icons/md';
const { Command } = require('./Command');
const { Sorting } = require('./Sorting');
let { setRxCommands } = require('../../helpers/rxCommands');

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Commands.scss');
const AddCommandPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  commands = {}
}) => {
  const [name, setName] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [uses, setUses] = useState<number>(0);
  const [permissions, setPermissions] = useState({});

  const saveToDB = () => {
    if (name.length === 0) return;
    let Commands = Object.assign({}, commands);
    Commands[name] = {
      reply,
      name,
      uses,
      permissions,
      enabled: true
    };
    setRxCommands(Commands);
  };

  const save = () => {
    if (isNaN(Number(uses))) return;
    setUses(Number(uses));
    saveToDB();
    closeCurrentPopup();
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
          onKeyDown={e => {
            if (e.key === 'Enter') {
              save();
            }
          }}
        />
        <div className={styles.input_name}>
          <span
            className={styles.hover}
            style={{
              color: stateTheme.main.highlightColor,
              fontWeight: 'bold'
            }}
            onClick={e => {
              e.preventDefault();
              shell.openExternal(
                'https://github.com/CreativeBuilds/dlive-chat-bot/wiki/Custom-Commands'
              );
            }}
          >
            Advanced Command Useage
          </span>
        </div>
      </div>
      <div
        className={styles.submit}
        onClick={save}
        style={{
          backgroundColor: stateTheme.menu.backgroundColor,
          color: stateTheme.menu.color,
          borderColor: stateTheme.menu.backgroundColor
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
        commands={commands}
      />
    );
  };

  return (
    <div style={stateTheme.base.secondaryBackground} className={styles.Points}>
      <div style={Object.assign({},stateTheme.toolBar, stateTheme.base.quaternaryForeground)} className={styles.header}>
        COMMANDS
        <textarea
          className={styles.usersearch}
          style={stateTheme.searchInput}
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
              commands={commands}
            />
          );
        })}
      </div>
    </div>
  );
};

export { CommandsPage };
