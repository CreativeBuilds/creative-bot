import * as React from 'react';
import { useState, useContext } from 'react';
import { ThemeContext } from '../../helpers';
import { MdSend } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Chat.scss');

const Chat = props => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([])
  let newMessage = (event, data) => {
    setMessages(messages.concat([data.message]))
  }
  console.log("messages", messages);
  ipcRenderer.on('newmessage', newMessage)
  return (
    <div style={stateTheme.menu} className={styles.Chat}>
      <div style={stateTheme.menu.title} className={styles.header}>
        CHAT
      </div>
      <div style={{}} className={styles.content}>
        {/* This is for the actual chat messages */}
      </div>
      <div style={stateTheme.menu['title_hover']} className={styles.input}>
      {/* TODO change maxLength to be limitless and then send messages once every 2 seconds to get around chat slowmode */}
        <textarea style={stateTheme.chat.input} maxLength={140} />
        <div className={styles.send} style={stateTheme.chat.input}>
          <MdSend />
        </div>
      </div>
    </div>
  );
};

export { Chat };
