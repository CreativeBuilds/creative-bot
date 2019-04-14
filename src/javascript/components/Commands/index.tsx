import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import * as _ from 'lodash';

const { Command } = require('./Command');
const { Sorting } = require('./Sorting');

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Commands.scss');

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
