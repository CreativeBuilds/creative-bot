import * as React from 'react';
import Styles from './Message.scss';
import { MdClose } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import { AddStickerPopup } from './AddStickerPopup';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Emote.scss');

interface Emote {
  stickerDLiveId: string;
  stickerUrl: string;
}

const Emote = ({ stickerUrl, stickerDLiveId} : Emote) => {

  const sendMessage = () => {
    ipcRenderer.send('sendmessage', { from: 'bot', message: stickerDLiveId });
  };

  return (
    <div className={styles.emote_container} onClick={sendMessage}>
        <img className={styles.emote} src={stickerUrl} />
    </div>
  );
};

export { Emote };