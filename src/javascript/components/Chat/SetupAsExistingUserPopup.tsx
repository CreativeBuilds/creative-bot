import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  MdClose,
  MdTimer,
  MdDoNotDisturb,
  MdCancel,
  MdCloudDownload,
  MdCheckCircle
} from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';
import { Panel } from '../Generics/Panel';
import { DragDrop } from '../Generics/DragDrop';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';

import Styles from './Chat.scss';
import { first } from 'rxjs/operators';

const { ipcRenderer, shell, remote, webFrame } = require('electron');
const { dialog, BrowserWindow, app } = remote;

interface popup {
  styles: any;
  stateTheme: any;
  Config?: any;
  closeCurrentPopup: Function | any;
  addPopup: any;
}

const SetupAsExistingUserPopup = ({
  styles,
  stateTheme,
  addPopup,
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [config, setConfig]: any = useState(Config);
  const [isCompatibleFile, setIsCompatibleFile] = useState<Boolean>(false);
  const [hasFile, setHasFile] = useState<Boolean>(false);
  const [filename, setFilename] = useState<String>('');
  const [path, setPath] = useState<String>('');

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const onDropHandler = (e, isCompatible) => {
    console.log('File dropped');
    console.log(e);

    if (e.length != 0 && isCompatible == true) {
      setIsCompatibleFile(true);
      setHasFile(true);
      setFilename(e[0].name);
      setPath(e[0].path);
    } else if (e.length != 0 && isCompatible === false) {
      setIsCompatibleFile(false);
      setHasFile(true);
      setFilename(e[0].name);
      setPath(e[0].path);
    } else {
      setIsCompatibleFile(false);
      setHasFile(false);
    }
  };

  const importBackupFile = () => {
    ipcRenderer.send('import-backup-data', path as string);
  };

  return (
    <div className={`${styles.popup}`}>
      <h2>Import from Backup File (Beta)</h2>
      <div className={`${styles.chatFilterPopup}`}>
        <p>
          To Import your Backed up Bot Data please drag & drop the .zip file
          below
        </p>
        <Panel
          hasHeader={false}
          style={Object.assign(
            {},
            stateTheme.dashedBorder,
            stateTheme.base.tertiaryBackground
          )}
          content={
            <DragDrop
              className={styles.dragDropContentBox}
              fileTypes={['zip']}
              draggedTitle='Drop Here'
              handleDrop={onDropHandler}
            >
              {hasFile ? (
                <div>
                  {isCompatibleFile ? (
                    <div>
                      <div className={styles.iconContainer}>
                        <MdCheckCircle />
                      </div>
                      <div className={styles.dragDropMessage}>Success</div>
                      <div className={styles.dragDropMessage}>{filename}</div>
                    </div>
                  ) : (
                    <div>
                      <div className={styles.iconContainer}>
                        <MdCancel />
                      </div>
                      <div className={styles.dragDropMessage}>
                        You have Dragged an Incompatible File, Please Try Again
                      </div>
                      <div className={styles.dragDropMessage}>{filename}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className={styles.iconContainer}>
                    <MdCloudDownload />
                  </div>
                  <div className={styles.dragDropMessage}>
                    Drag & Drop .Zip file here
                  </div>
                </div>
              )}
            </DragDrop>
          }
        />
        <p className={styles.requiredText}>*Relaunch of the Bot is Required</p>
      </div>
      <div
        className={styles.submit}
        style={Object.assign(
          {},
          !hasFile ? stateTheme.disabledSubmitButton : null,
          stateTheme.submitButton
        )}
        onClick={() => {
          if (hasFile) {
            importBackupFile();

            setTimeout(function() {
              remote.app.relaunch();
              remote.app.exit();
            }, 1000);
          }
        }}
      >
        Relaunch & Continue
      </div>
    </div>
  );
};

export { SetupAsExistingUserPopup };
