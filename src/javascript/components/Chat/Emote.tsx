import * as React from 'react';
import { MdClose } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Emote.scss');

interface Emote {
  stickerDLiveId: string;
  stickerUrl: string;
  canDelete?: Boolean;
  onDelete?: () => void;
}

const Emote = ({ stickerUrl, stickerDLiveId, canDelete = false, onDelete} : Emote) => {

  const sendMessage = () => {
    ipcRenderer.send('sendmessage', { from: 'bot', message: stickerDLiveId });
  };

  return (
    <div className={styles.emote_container}>
        {canDelete ? <div className={styles.emoteDeleteButton} onClick={onDelete}>
          <MdClose />
        </div> : null}
        <div onClick={sendMessage}>
          <img className={styles.emote} src={stickerUrl} />
        </div>
    </div>
  );
};

export { Emote };