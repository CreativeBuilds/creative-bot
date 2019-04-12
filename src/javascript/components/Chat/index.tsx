import * as React from 'react';
import { useContext, Component, useState } from 'react';
import { ThemeContext } from '../../helpers';
import { MdSend } from 'react-icons/md';

import { Message } from './Message';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Chat.scss');

class ChatWrap extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    let newMessage = (event, data) => {
      let newArr = [...this.state.messages, data.message];
      this.setState({ messages: newArr });
    };
    ipcRenderer.on('newmessage', newMessage);
  }

  render() {
    return (
      <ChatComponent
        props={Object.assign({ messages: this.state.messages }, this.props)}
      />
    );
  }
}

const ChatComponent = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [text, setText] = useState('');
  const { messages } = props;

  const updateText = e => {
    console.log('e', e, text);
    setText(e.target.value);
  };

  const sendMessage = () => {
    ipcRenderer.send('sendmessage', { from: 'bot', message: text });
    setText('');
  };

  const onEnterPress = e => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={stateTheme.menu} className={styles.Chat}>
      <div style={stateTheme.menu.title} className={styles.header}>
        CHAT
      </div>
      <div style={{}} className={styles.content}>
        {messages.map((message, nth) => {
          return (
            <Message
              styles={styles}
              message={message}
              stateTheme={stateTheme}
              nth={nth}
            />
          );
        })}
        {/* This is for the actual chat messages */}
      </div>
      <div style={stateTheme.menu['title_hover']} className={styles.input}>
        {/* TODO change maxLength to be limitless and then send messages once every 2 seconds to get around chat slowmode */}
        <textarea
          style={stateTheme.chat.input}
          value={text}
          maxLength={140}
          onKeyDown={onEnterPress}
          onChange={e => {
            updateText(e);
          }}
        />
        <div
          className={styles.send}
          style={stateTheme.chat.input}
          onClick={sendMessage}
        >
          <MdSend />
        </div>
      </div>
    </div>
  );
};

const Chat = props => {
  return <ChatWrap props={props} />;
};

export { Chat };
