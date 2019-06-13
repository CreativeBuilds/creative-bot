import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import Styles from './Message.scss';
import { MdClose, MdAdd } from 'react-icons/md';
import { AddStickerPopup } from './AddStickerPopup';
import { rxConfig, setRxConfig } from '../../helpers/rxConfig';
import {
  removeMessage,
  timeoutUser,
  muteUser
} from '../../helpers/removeMessage';

import { UserPopup } from './UserPopup';

enum MessageHeaderType {
  normal,
  event
}

enum MessageContentType {
  normal,
  event,
  sticker,
  stickerAsText
}

const MessageHeader = ({ styles, message, onClick, headerType }) => {
  return (
    <div
      className={
        headerType == MessageHeaderType.normal
          ? styles.messageHeader
          : `${styles.messageHeader}`
      }
    >
      <div className={styles.image_container}>
        <img src={message.sender.avatar} width={26} height={26} />
      </div>
      <span className={styles.username_container} onClick={onClick}>
        {message.sender.dliveUsername}
        {': '}
      </span>
    </div>
  );
};

const MessageContent = ({
  styles,
  message = null,
  evntMsg = null,
  src = null,
  onClick = null,
  contentType
}) => {
  return (
    <div className={styles.message_content}>
      {contentType == MessageContentType.normal ? (
        <div className={styles.message_content}>{message.content}</div>
      ) : contentType == MessageContentType.sticker ? (
        <div className={styles.sticker_container}>
          <div className={styles.emoteDeleteButton} onClick={onClick}>
            <MdAdd />
          </div>
          <img className={styles.sticker} src={src} />
        </div>
      ) : contentType == MessageContentType.stickerAsText ? (
        <div className={styles.sticker_container}>
          <div className={styles.emoteDeleteButton} onClick={onClick}>
            <MdAdd />
          </div>
          <div className={styles.message_content}>{message.content}</div>
        </div>
      ) : (
        <div className={styles.message_content}>
          <div className={styles.message_content}>{evntMsg}</div>
        </div>
      )}
    </div>
  );
};

const DeleteButton = ({ styles, onDelete }) => {
  return (
    <div className={styles.message_remove}>
      <MdClose onClick={onDelete} />
    </div>
  );
};

const Message = ({
  styles,
  Config,
  message,
  nth,
  stateTheme,
  ownerName,
  addPopup,
  closeCurrentPopup
}) => {
  const [hasFilteredEvents, setHasFilteredEvents] = useState(
    Config.enableEvents
  );
  const [hasFilteredStickers, setHasFilteredStickers] = useState(
    Config.enableStickers
  );
  const [hasStickersAsText, setHasStickersAsText] = useState(
    Config.enableStickersAsText
  );
  const [config, setConfig] = useState(Config);

  useEffect(() => {
    let listener = rxConfig.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setHasFilteredEvents(data.enableEvents);
      setHasFilteredStickers(data.enableStickers);
      setHasStickersAsText(data.enableStickersAsText);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  // Boolean Checks if Message Type is a Event Based Message or Not
  const isEvent = () => {
    if (message.type === 'Gift') {
      return true;
    } else if (message.type === 'Follow') {
      return true;
    } else if (message.type === 'Subscription') {
      return true;
    } else if (message.type === 'Message') {
      return false;
    }
  };

  const giftEmoteType = () => {
    if (message.gift === 'LEMON') {
      return '🍋';
    } else if (message.gift === 'ICE_CREAM') {
      return '🍦';
    } else if (message.gift === 'DIAMOND') {
      return '💎';
    } else if (message.gift === 'NINJAGHINI') {
      return '🐱‍👤🚗';
    } else if (message.gift === 'NINJET') {
      return '🐱‍👤✈';
    }
  };

  const giftType = () => {
    if (message.gift === 'LEMON') {
      return 'LEMON';
    } else if (message.gift === 'ICE_CREAM') {
      return 'ICE CREAM';
    } else if (message.gift === 'DIAMOND') {
      return 'DIAMOND';
    } else if (message.gift === 'NINJAGHINI') {
      return 'NINJAGHINI';
    } else if (message.gift === 'NINJET') {
      return 'NINJET';
    }
  };

  const eventMessage = () => {
    if (message.type === 'Gift') {
      return `just donated ${message.amount} ${giftType()} ${giftEmoteType()}`;
    } else if (message.type === 'Follow') {
      return 'Has Just Followed';
    } else if (message.type === 'Subscription') {
      return 'Has Just Subscribed';
    }
  };
  // Boolean Checks if Message is a Sticker or not
  const isSticker = () => {
    var content = message.content;
    if (!content || typeof content === 'undefined') return false;
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

  const getStickerId = (id: String) => {
    var routes = id.replace(/[:]/gi, '').split('/');
    var imageRoute = routes[routes.length - 1];
    return imageRoute;
  };

  // if message is sticker then it is compiled into a url (returns a String)
  const getSticker = (str: String) => {
    var url = 'https://images.prd.dlivecdn.com/emote/' + getStickerId(str);
    console.log('Sticker URL:' + url);
    return url;
  };

  const canDelete = () => {
    return message.roomRole !== 'Owner' && message.role === 'None';
  };

  const addUserPopup = () => {
    addPopup(
      <UserPopup
        closeCurrentPopup={closeCurrentPopup}
        user={message.sender}
        stateTheme={stateTheme}
        canDelete={canDelete()}
        muteUser={() => {
          muteUser(
            message.sender.blockchainUsername,
            message.streamerBlockchainUsername
          );
        }}
        timeoutUser={() => {
          timeoutUser(
            message.sender.blockchainUsername,
            message.streamerBlockchainUsername
          );
        }}
        deleteMessage={
          canDelete()
            ? () => {
                removeMessage(message.id, message.streamerBlockchainUsername);
              }
            : () => {}
        }
      />
    );
  };

  const addSticker = () => {
    addPopup(
      <AddStickerPopup
        stickerId={getStickerId(message.content)}
        stickerDLiveId={message.content}
        stickerUrl={getSticker(message.content)}
        stateTheme={stateTheme}
        styles={styles}
        Config={Object.assign({}, config)}
        text={<span>Stickers</span>}
        closeCurrentPopup={closeCurrentPopup}
      />
    );
  };

  return (
    <div>
      {isEvent() ? (
        hasFilteredEvents ? (
          <div className={styles.messageEvent}>
            {message.sender ? (
              <MessageHeader
                styles={styles}
                message={message}
                headerType={MessageHeaderType.event}
                onClick={e => {
                  addUserPopup();
                }}
              />
            ) : null}
            {message.content ? (
              <MessageContent
                styles={styles}
                evntMsg={eventMessage()}
                contentType={MessageContentType.event}
              />
            ) : null}
          </div>
        ) : null
      ) : isSticker() ? (
        hasFilteredStickers ? (
          <div
            className={`${styles.message} ${
              message.content
                ? message.content.toLowerCase().includes(ownerName)
                  ? Styles.highlighted
                  : ''
                : ''
            }`}
            style={Object.assign(
              {},
              stateTheme.chat.message,
              nth % 2 ? stateTheme.chat.message.alternate : {}
            )}
          >
            <MessageHeader
              styles={styles}
              headerType={MessageHeaderType.normal}
              message={message}
              onClick={e => {
                addUserPopup();
              }}
            />
            {!hasStickersAsText ? (
              <MessageContent
                styles={styles}
                message={message}
                src={getSticker(message.content)}
                onClick={addSticker}
                contentType={MessageContentType.sticker}
              />
            ) : (
              <MessageContent
                styles={styles}
                message={message}
                onClick={addSticker}
                contentType={MessageContentType.stickerAsText}
              />
            )}
            {canDelete() ? (
              <DeleteButton
                styles={styles}
                onDelete={() => {
                  removeMessage(message.id, message.streamerBlockchainUsername);
                }}
              />
            ) : null}
          </div>
        ) : null
      ) : (
        <div
          className={`${styles.message} ${
            message.content
              ? message.content.toLowerCase().includes(ownerName)
                ? Styles.highlighted
                : ''
              : ''
          }`}
          style={Object.assign(
            {},
            stateTheme.chat.message,
            nth % 2 ? stateTheme.chat.message.alternate : {}
          )}
        >
          <MessageHeader
            styles={styles}
            message={message}
            headerType={MessageHeaderType.normal}
            onClick={e => {
              addUserPopup();
            }}
          />
          <MessageContent
            styles={styles}
            message={message}
            contentType={MessageContentType.normal}
          />
          {canDelete() ? (
            <DeleteButton
              styles={styles}
              onDelete={() => {
                removeMessage(message.id, message.streamerBlockchainUsername);
              }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export { Message };
