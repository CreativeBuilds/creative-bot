import * as React from 'react';
import { useState } from 'react';

import { ModBox } from './ModBox';
import { BannedBox } from './BannedBox';

import { MdModeEdit } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');
import { setRxConfig } from '../../helpers/rxConfig';
import { ipcMain } from 'electron';
import { AdvancedDiv } from '../Generics/AdvancedDiv';
import { theme } from '../../helpers/Theme';

const Popup = ({
  configOption,
  styles,
  closeCurrentPopup,
  stateTheme,
  config
}) => {
  const [value, setValue] = useState<string>(configOption.value.toString());
  const [error, setError] = useState<string>('');

  return (
    <div className={styles.popup}>
      <h1>{configOption.name}</h1>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Name</div>
        <input
          className={styles.input}
          onChange={e => {
            let val = e.target.value;
            if (configOption.key === 'pointsTimer') {
              let numVal = Number(val);
              if (numVal < 60) {
                setError('Minimum amount for interval is 60 seconds');
              } else {
                setError('');
              }
            }
            setValue(e.target.value);
          }}
          value={value}
        />
      </div>
      {error.length ? (
        <div
          style={{
            width: '60%',
            textAlign: 'left',
            marginBottom: '5px',
            color: theme.globals.destructive.backgroundColor
          }}
        >
          {error}
        </div>
      ) : null}
      <AdvancedDiv
        className={styles.submit}
        style={stateTheme.submitButton}
        hoverStyle={stateTheme.submitButton_hover}
        aStyle={{ width: '60%' }}
      >
        <div
          onClick={() => {
            if (error.length > 0) return;
            let Config = Object.assign({}, config);
            switch (configOption.type) {
              case 'number':
                Config[configOption.key] = Number(value);
              case 'string':
                Config[configOption.key] = String(value);
              default:
                Config[configOption.key] = value;
            }
            let passedConfig = () => {
              closeCurrentPopup();
              ipcRenderer.removeListener('failedConfig', failedConfig);
            };
            let failedConfig = (obj, err) => {
              setError(err);
              ipcRenderer.removeListener('passedConfig', passedConfig);
            };
            ipcRenderer.once('passedConfig', passedConfig);
            ipcRenderer.once('failedConfig', failedConfig);
            setRxConfig(Config);
          }}
        >
          SAVE
        </div>
      </AdvancedDiv>
    </div>
  );
};

const updateConfigOption = (
  option,
  styles,
  closeCurrentPopup,
  stateTheme,
  addPopup,
  config
) => {
  addPopup(
    <Popup
      configOption={option}
      styles={styles}
      closeCurrentPopup={closeCurrentPopup}
      stateTheme={stateTheme}
      config={config}
    />
  );
};

const Config = ({
  styles,
  configOption,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup,
  config
}) => {
  const [hidden, setHidden] = useState<boolean>(!!configOption.hidden);

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
        <div className={styles.username}>{configOption.name}</div>
        <div
          className={styles.value}
          onClick={() => {
            if (!configOption.hidden) return;
            // setHidden(!hidden);
          }}
        >
          {hidden ? 'HIDDEN' : configOption.value}
        </div>
        <div className={styles.edit}>
          <MdModeEdit
            onClick={() => {
              updateConfigOption(
                configOption,
                styles,
                closeCurrentPopup,
                stateTheme,
                addPopup,
                config
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Config };
