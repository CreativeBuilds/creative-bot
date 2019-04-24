import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { ThemeContext } from '../../helpers';
import { MdSend } from 'react-icons/md';

import { Message } from './Message';
import rxConfig from '../../../../helpers/rxConfig';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const styles: any = require('./Chat.scss');

const AddCommandPopup = ({
  styles,
  closeCurrentPopup,
  stateTheme,
  configName,
  text = '',
  buttonText = 'NEXT'
}) => {
  const [name, setName] = useState<string>('');
  const [helperText, SetHelperText] = useState<string>(text);

  const setError = error => {
    SetHelperText(error);
    setTimeout(() => {
      SetHelperText(text);
    }, 5000);
  };

  const isError = () => {
    return helperText !== text;
  };

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <div className={styles.input_wrapper}>
        <div className={styles.input_name}>{configName}</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setName(e.target.value);
          }}
          value={name}
        />
      </div>
      <div
        className={styles.helper_text}
        style={isError() ? { color: 'red' } : {}}
      >
        {helperText}
      </div>
      <div
        className={styles.submit}
        onClick={() => {
          closeCurrentPopup(name, setError);
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

const Chat = ({ props }) => {
  const { stateTheme, setStateTheme } = useContext(ThemeContext);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [text, setText] = useState('');
  const { Messages, addPopup, closeCurrentPopup } = props;

  const [config, setConfig]: any = useState({ first: true });

  const updateText = e => {
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

  useEffect(() => {
    let element: any = document.getElementById('messages');
    element.addEventListener('scroll', function(event) {
      var element = event.target;
      if (
        element.scrollHeight - element.scrollTop - 20 <=
        element.clientHeight
      ) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }
    });
    let listener = rxConfig.subscribe((data: any) => {
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isScrolledUp) return;
    document.getElementById('bottomOfMessages').scrollIntoView();
  }, [Messages]);

  useEffect(() => {
    // Test to see if the config includes the right variables
    // if's at the top of this will be rendered last
    console.log('CONFIG', config);
    if (!config.streamer) {
      addPopup(
        <AddCommandPopup
          styles={styles}
          closeCurrentPopup={(input, setError) => {
            if (input !== '') {
              let Config = Object.assign({}, { streamer: input });
              closeCurrentPopup();
            } else {
              setError('Input field must not be empty!');
            }
          }}
          stateTheme={stateTheme}
          configName={'LINO Blockchain Name'}
        />
      );
    }
  }, [config]);

  return (
    <div style={stateTheme.menu} className={styles.Chat}>
      <div style={stateTheme.menu.title} className={styles.header}>
        CHAT
      </div>
      <div style={{}} className={styles.content} id='messages'>
        {Messages.map((message, nth) => {
          return (
            <Message
              styles={styles}
              message={message}
              stateTheme={stateTheme}
              nth={nth}
            />
          );
        })}
        <div id={'bottomOfMessages'} />
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

export { Chat };
