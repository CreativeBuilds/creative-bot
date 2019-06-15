import * as React from 'react';
import { useState, useEffect } from 'react';
import { MdClose, MdTimer, MdDoNotDisturb, MdCancel, MdCloudDownload, MdCheckCircle } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import ReactTooltip from 'react-tooltip';
import { Panel } from '../Generics/Panel';
import { DragDrop } from '../Generics/DragDrop';

import { rxUsers, setRxUsers } from '../../helpers/rxUsers';

import Styles from './Chat.scss';
import { first } from 'rxjs/operators';

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
  }: popup)  => {
    const [isCompatibleFile, setIsCompatibleFile] = useState<Boolean>(false);
    const [hasFile, setHasFile] = useState<Boolean>(false);

    const onDropHandler = (e) => {
        console.log('File dropped');
        console.log(e);
        var filename = e[0].name;
        var path = e[0].path;

        if (e != null || e[0] != null || e[0] != "" || e.length != 0) {
            setIsCompatibleFile(true);
            setHasFile(true);
        } else {
            setIsCompatibleFile(false);
            setHasFile(false);
        }
    }

    return (
        <div className={`${styles.popup}`}>
            <h2>Import from Backup File</h2>
            <div className={`${styles.chatFilterPopup}`}>
                <p>To Import your Backed up Bot Data please drag & drop the .zip file below</p>
                <Panel hasHeader={false} style={Object.assign({}, stateTheme.dashedBorder, stateTheme.base.tertiaryBackground)} content={
                    <DragDrop className={styles.dragDropContentBox} fileType={['zip']} draggedTitle="Drop Here" handleDrop={onDropHandler}>
                        {hasFile ? 
                            <div> 
                                {isCompatibleFile ? 
                                <div> 
                                    <div className={styles.iconContainer}>
                                        <MdCheckCircle />
                                    </div>
                                    <div className={styles.dragDropMessage}>Success</div>
                                </div>
                                :
                                <div> 
                                    <div className={styles.iconContainer}>
                                        <MdCancel />
                                    </div>
                                    <div className={styles.dragDropMessage}>You have Dragged an Incompatible File</div>
                                </div>
                                }
                            </div>  
                        :
                            <div> 
                                <div className={styles.iconContainer}>
                                    <MdCloudDownload />
                                </div>
                                <div className={styles.dragDropMessage}>Drag & Drop .Zip file here</div>
                            </div>
                        }
                    </DragDrop>
                } />
            </div>
            <div
            className={styles.submit}
            style={stateTheme.submitButton}
            onClick={() => { 
                closeCurrentPopup();
                }}>
            Continue
            </div>
        </div>
  );
};

export { SetupAsExistingUserPopup };