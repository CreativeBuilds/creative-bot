import * as React from 'react';
import Styles from './Message.scss';

const Message = ({ styles, message, nth, stateTheme, ownerName }) => {
  console.log(message.content.toLowerCase().includes(ownerName));
  return (
    <div
      className={`${styles.message} ${
        message.content.toLowerCase().includes(ownerName)
          ? Styles.highlighted
          : ''
      }`}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.image_container}>
        <img src={message.sender.avatar} width={26} height={26} />
      </div>
      <div className={styles.message_content}>
        <span>{message.sender.dliveUsername}</span>
        {': '}
        {message.content}
      </div>
    </div>
  );
};

export { Message };
