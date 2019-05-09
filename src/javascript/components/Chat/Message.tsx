import * as React from 'react';
import Styles from './Message.scss';
import { MdClose } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';

const Message = ({ styles, message, nth, stateTheme, ownerName }) => {
  // Boolean Checks if Message is a Sticker or not
  const isSticker = () => {
    var content = message.content;
    if (content.search(/[:]/gi) > -1) {
      if (content.search(/emote/gi) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // if message is sticker then it is compiled into a url (returns a String)
  const getSticker = (str: String) => {
    var routes = str.replace(/[:]/gi, '').split('/');
    var imageRoute = routes[routes.length - 1];
    var url = 'https://images.prd.dlivecdn.com/emote/' + imageRoute;
    console.log('Sticker URL:' + url);
    return url;
  };

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
        {isSticker() ? (
          <div className={styles.sticker_container}>
            <img
              className={styles.sticker}
              src={getSticker(message.content)}
              width='80'
              height='80px'
            />
          </div>
        ) : (
          <div className={styles.message}>{message.content}</div>
        )}
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
