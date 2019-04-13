import * as React from 'react';

const Message = ({ styles, message, nth, stateTheme }) => {
  return (
    <div
      className={styles.message}
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
        <span>{message.sender.displayname}</span>
        {': '}
        {message.content}
      </div>
    </div>
  );
};

export { Message };
