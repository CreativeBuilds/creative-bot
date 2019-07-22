import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdClose, MdAdd } from 'react-icons/md';
import { AddStickerPopup } from '../Chat/AddStickerPopup';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { 
  AdvancedDiv,
  WidgetButton,
  BubbleButton
 } from '../Generics/CreativeUI';
import {
  removeMessage,
  timeoutUser,
  muteUser
} from '../../helpers/removeMessage';

import { UserPopup } from '../Chat/UserPopup';
import { theme } from '../../helpers';

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

const MessageHeader = ({
  stateTheme,
  message,
  onClick,
  headerType,
  hasTimestamp = true,
  hasTimestampAsDigital = true
}) => {
  return (
    <div
      style={stateTheme.chatPage.message.header}
    >
      {hasTimestamp ? (
        <div style={stateTheme.chatPage.message.header.timestamp}>
          <span>
            {hasTimestampAsDigital
              ? message.Msg_timestamp_digital
              : message.Msg_timestamp}
          </span>
        </div>
      ) : null}
      <div style={stateTheme.chatPage.message.header.container}>
        <img style={stateTheme.chatPage.message.header.image} src={message.sender.avatar} width={26} height={26} />
      </div>
      <span style={stateTheme.chatPage.message.header.username} onClick={onClick}>
        {message.sender.dliveUsername}
        {': '}
      </span>
    </div>
  );
};

const MessageContent = ({
  stateTheme,
  message = null,
  evntMsg = null,
  src = null,
  onClick = null,
  contentType
}) => {
  const [isHovering, setHovering] = useState<Boolean>(false);

  return (
    <div style={stateTheme.chatPage.message.content}>
      {contentType == MessageContentType.normal ? (
        <div style={stateTheme.chatPage.message.content}>{message.content}</div>
      ) : contentType == MessageContentType.sticker ? (
        <AdvancedDiv 
          style={stateTheme.chatPage.message.imageContainer} 
          onHover={(e) => { setHovering(e); }}>
          <div>
            {isHovering ? <BubbleButton icon={<MdAdd />} stateTheme={stateTheme} onClick={onClick} /> : null }
            <img style={stateTheme.chatPage.message.imageContainer.image} src={src} />
          </div>
        </AdvancedDiv>
      ) : contentType == MessageContentType.stickerAsText ? (
        <AdvancedDiv 
          style={stateTheme.chatPage.message.imageContainer} 
          onHover={(e) => { setHovering(e); }}>
          <div>
            {isHovering ? <BubbleButton icon={<MdAdd />} stateTheme={stateTheme} onClick={onClick} /> : null }
            <div style={stateTheme.chatPage.message.content}>{message.content}</div>
          </div>
        </AdvancedDiv>
      ) : (
        <div style={stateTheme.chatPage.message.content}>
          <div style={stateTheme.chatPage.message.content}>{evntMsg}</div>
        </div>
      )}
    </div>
  );
};

const Message = ({
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
  const [hasFilteredTimestamps, setHasFilteredTimestamps] = useState(
    Config.enableTimestamps
  );
  const [hasTimestampsAsDigital, setHasTimestampsAsDigital] = useState(
    Config.enableTimestampsAsDigital
  );
  const [config, setConfig] = useState(Config);

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
      setHasFilteredEvents(data.enableEvents);
      setHasFilteredStickers(data.enableStickers);
      setHasStickersAsText(data.enableStickersAsText);
      setHasFilteredTimestamps(data.enableTimestamps);
      setHasTimestampsAsDigital(data.enableTimestampsAsDigital);
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
        stickerDLiveId={message.content.replace('channel', 'mine')}
        stickerUrl={getSticker(message.content)}
        stateTheme={stateTheme}
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
          <div style={Object.assign({}, theme.globals.accentBackground, stateTheme.chatPage.message.type.event)}>
            {message.sender ? (
              <MessageHeader
                stateTheme={stateTheme}
                message={message}
                headerType={MessageHeaderType.event}
                hasTimestamp={hasFilteredTimestamps}
                hasTimestampAsDigital={hasTimestampsAsDigital}
                onClick={e => {
                  addUserPopup();
                }}
              />
            ) : null}
            {message.content ? (
              <MessageContent
                stateTheme={stateTheme}
                evntMsg={eventMessage()}
                contentType={MessageContentType.event}
              />
            ) : null}
          </div>
        ) : null
      ) : isSticker() ? (
        hasFilteredStickers ? (
          <div
            style={Object.assign(
              {},
              Object.assign({},
              stateTheme.cell.normal,
              nth % 2 ? stateTheme.cell.alternate : {}),
              Object.assign({},
                message.content.toLowerCase().includes(ownerName)
                ? Object.assign({}, theme.globals.accentDarkBorderColor, stateTheme.chatPage.message.type.normal.highlighted)
                : null,
                stateTheme.chatPage.message.type.normal)
            )}
          >
            {message.sender ? (
              <MessageHeader
                stateTheme={stateTheme}
                message={message}
                headerType={MessageHeaderType.normal}
                hasTimestamp={hasFilteredTimestamps}
                hasTimestampAsDigital={hasTimestampsAsDigital}
                onClick={e => {
                  addUserPopup();
                }}
              />
            ) : null}
            {!hasStickersAsText ? (
              message.content ? (
                <MessageContent
                  stateTheme={stateTheme}
                  message={message}
                  src={getSticker(message.content)}
                  onClick={addSticker}
                  contentType={MessageContentType.sticker}
                />
              ) : null
            ) : message.content ? (
              <MessageContent
                stateTheme={stateTheme}
                message={message}
                onClick={addSticker}
                contentType={MessageContentType.stickerAsText}
              />
            ) : null}
            {canDelete() ? (
              <WidgetButton 
              icon={<MdClose style={stateTheme.button.widget.closePopup.icon}/>} 
              stateTheme={stateTheme}
              style={stateTheme.button.widget.deleteMsg}
              onClick={() => {
                removeMessage(message.id, message.streamerBlockchainUsername);
              }}/>
            ) : null}
          </div>
        ) : null
      ) : (
        <div
        style={Object.assign(
          {},
          Object.assign({},
          stateTheme.cell.normal,
          nth % 2 ? stateTheme.cell.alternate : {}),
          Object.assign({},
            message.content.toLowerCase().includes(ownerName)
            ? Object.assign({}, theme.globals.accentDarkBorderColor, stateTheme.chatPage.message.type.normal.highlighted)
            : null,
            stateTheme.chatPage.message.type.normal)
        )}
        >
          {message.sender ? (
            <MessageHeader
              stateTheme={stateTheme}
              message={message}
              headerType={MessageHeaderType.normal}
              hasTimestamp={hasFilteredTimestamps}
              hasTimestampAsDigital={hasTimestampsAsDigital}
              onClick={e => {
                addUserPopup();
              }}
            />
          ) : null}
          {message.content ? (
            <MessageContent
              stateTheme={stateTheme}
              message={message}
              contentType={MessageContentType.normal}
            />
          ) : null}

          {canDelete() ? (
            <WidgetButton 
              icon={<MdClose style={stateTheme.button.widget.closePopup.icon}/>} 
              stateTheme={stateTheme}
              style={stateTheme.button.widget.deleteMsg}
              onClick={() => {
                removeMessage(message.id, message.streamerBlockchainUsername);
              }}/>
          ) : null}
        </div>
      )}
    </div>
  );
};

export { Message };
