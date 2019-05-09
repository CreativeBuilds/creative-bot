import * as React from 'react';
import Styles from './Message.scss';
import { MdClose } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';

const Message = ({ styles, message, nth, stateTheme, ownerName }) => {
  const canDelete = () => {
    return message.roomRole === 'Member' && message.role === 'None';
  };
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
        <span>
          {message.sender.dliveUsername}
          {': '}
        </span>
        {message.content}
      </div>
      {canDelete() ? (
        <div className={styles.message_remove}>
          <MdClose
            onClick={() => {
              removeMessage(message.id, message.streamerBlockchainUsername);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export { Message };
