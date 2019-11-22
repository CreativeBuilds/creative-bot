import * as React from 'react';
import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';
import { IChatColors, IChatObject, IGiftObject } from '@/renderer';
import { getPhrase } from '@/renderer/helpers/lang';
import { Icon } from '../generic-styled-components/Icon';
import { FaEyeSlash, FaEye, FaPlus } from 'react-icons/fa';
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';

import {
  listItemColor,
  listItemBackgroundColor,
  listItemAlternativeColor,
  eventColor,
  eventBackgroundColor
} from '@/renderer/helpers/appearance';

interface IChatProps {
  alternateBackground?: string;
  padTop?: boolean;
  highlighted?: boolean;
  highlightedBackground?: string;
  isEvent?: boolean;
}

const Chat = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  min-width: -webkit-fill-available;
  padding-top: ${(props: IChatProps): string =>
    props.padTop ? '30px' : 'unset'};
  height: 55px;
  background: ${(props: IChatProps): ThemeSet | string =>
    props.isEvent ? eventBackgroundColor : 'transparent'};
  color: ${(props: IChatProps): ThemeSet | string =>
    props.isEvent ? eventColor : listItemColor};
  &:nth-child(even) {
    background: ${(props: IChatProps): ThemeSet | string =>
      props.highlighted
        ? props.highlightedBackground
          ? props.highlightedBackground
          : '#922cce33'
        : props.isEvent
        ? eventBackgroundColor
        : props.alternateBackground
        ? props.alternateBackground
        : listItemAlternativeColor
        ? listItemAlternativeColor
        : '#e1e1e1'};
  }
`;

interface IPPProps {
  borderColor?: string;
  shadowColor?: string;
}

const ProfilePicture = styled.img`
  width: 37px;
  height: 37px;
  border-radius: 50%;
  margin-left: 10px;
  border: 2px solid
    ${(props: IPPProps): string =>
      props.borderColor ? props.borderColor : '#ffffff'};
  box-shadow: 0px 0px 2px 2px
    ${(props: IPPProps): string =>
      props.shadowColor ? props.shadowColor : 'rgba(56,62,225,0.65)'};
`;

const ChatContent = styled.div`
  flex: 1;
  max-height: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  padding-left: 15px;
  padding-right: 15px;
  word-wrap: break-word;
`;
const StickerContent = styled.div`
  flex: 1;
  max-height: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  padding-left: 15px;
  padding-right: 15px;
  word-wrap: break-word;
`;
const FollowContent = styled.div`
  flex: 1;
  max-height: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  padding-left: 15px;
  padding-right: 15px;
  word-wrap: break-word;
`;
const GiftContent = styled.div`
  flex: 1;
  max-height: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  padding-left: 15px;
  padding-right: 15px;
  word-wrap: break-word;
`;
const ChatSticker = styled.img`
  height: 48px;
  overflow: hidden;
`;

const ChatUsername = styled.div`
  position: absolute;
  top: 2px;
  left: 10px;
  font-size: 17px;
  border-bottom: 1px dashed;
`;

const StickerContainer = styled.div`
    display: inline-flex;
    position: relative;
`;

const StickerAddCircle = styled.div`
      display: flex;
      position: absolute;
      height: 36px;
      width: 36px;
      background-color: rgba(255,255,255,0.7);
      border-radius: 50%;
      left: 12.5%;
      top: 12.5%;

      svg {
        stroke: #000000;
        fill: #000000;
        text-align: center;
        vertical-align: middle;
        margin: auto;
      }

      box-shadow: 1px 0px 5px 1px #000000
`;

/**
 * @description the actual line for content
 */
export const ChatMessage = ({
  message,
  colors = {
    owner: 'rgba(56,62,225,0.65)',
    bot: `rgba(104,52,215,0.65)`,
    staff: `rgba(248,83,231,0.65)`,
    moderator: `rgba(6,172,0,0.65)`,
    viewer: `rgba(255,255,255,0)`
  },
  highlighted,
  onAddStickerClick = (message) => {}
}: {
  message: IChatObject | IGiftObject;
  colors?: IChatColors;
  highlighted: boolean;
  onAddStickerClick?: (e?: IChatObject | IGiftObject) => void;
}) => {
  /**
   * @description state for when a message is deleted, the user has the option to check to see what the message was by clicking on the eyeball
   */
  const [deletedButShow, setDeletedButShow] = React.useState(false);
  const [isHoveringOnSticker, setHoveringOnSticker] = React.useState<Boolean>(false);

  const determineBoxShadow = (): string => {
    // const sender = message.sender;
    const roomRole = message.roomRole;
    if (roomRole === 'Owner') {
      return colors.owner;
    }
    if (message.role === 'Bot') {
      return colors.bot;
    }
    if (message.role === 'Staff') {
      return colors.staff;
    }
    if (roomRole === 'Moderator') {
      return colors.moderator;
    }

    return colors.viewer;
  };

  const updateShow = () => {
    setDeletedButShow(!deletedButShow);
  };

  /**
   * @description Boolean Checks if Message Type is a Event Based Message or Not
   */
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

  /**
   * @description Checks if Gift Type is one of 5 Types and Displays the right emote
   */
  const giftEmoteType = (message: IGiftObject) => {
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

  /**
   * @description Checks if Gift Type is one of 5 Types and Displays the right text
   */
  const giftType = (message: IGiftObject) => {
    if (message.gift === 'LEMON') {
      return 'Lemon';
    } else if (message.gift === 'ICE_CREAM') {
      return 'Ice Cream';
    } else if (message.gift === 'DIAMOND') {
      return 'Diamond';
    } else if (message.gift === 'NINJAGHINI') {
      return 'Ninjaghini';
    } else if (message.gift === 'NINJET') {
      return 'Ninjet';
    }
  };

  /**
   * @description Checks the type of message sent
   */
  const eventMessage = (): string => {
    if (message.type === 'Gift') {
      return `just donated ${(message as IGiftObject).amount} ${giftType(
        message as IGiftObject
      )} ${giftEmoteType(message as IGiftObject)}!`;
    } else if (message.type === 'Follow') {
      return 'Has Just Followed';
    } else if (message.type === 'Subscription') {
      return 'Has Just Subscribed';
    } else {
      return '';
    }
  };

  const isSticker = () => {
    if (!message.content) {
      return false;
    } else {
      if (message.content.search(/^[:]emote/gi) > -1) {
        return true;
      } else {
        return false;
      }
    }
  };
  const isGift = () => {
    if (!message.type) {
      return false;
    }
    if (message.type === 'Gift') {
      return true;
    }
    return false;
  };

  const isFollow = () => {
    if (!message.type) {
      return false;
    }
    if (message.type === 'Follow') {
      return true;
    }
    return false;
  };

  const isSub = () => {
    if (!message.type) {
      return false;
    }
    if (message.type === 'Subscription') {
      return true;
    }
    return false;
  };

  const isChat = () => {
    if (!message.content) {
      return false;
    }

    return isGift() || isFollow() || isSticker() || isSub();
  };

  const stickerUrl = (): string => {
    var stickerLink: string = '';
    if (!message.content) {
      return '';
    } else {
      var sticker = message.content;
      if (isSticker()) {
        stickerLink =
          'https://images.prd.dlivecdn.com/emote/' +
          sticker.substring(sticker.lastIndexOf('/') + 1, sticker.length - 1);
      }
    }
    return stickerLink;
  };

  const stickerHoverStyle = (): HoverStyle => {
    var style: HoverStyle = new HoverStyle();
    style.hasBorder = false;
    style.borderColor = '#ffffff';
    style.borderWidth = '2px';
    style.borderType = 'solid';
    style.borderRadius = '0px';
    style.cursor = 'pointer';
    return style;
  }

  /**
   * @description will return a chat message row, if the message is deleted then it will show text
   * saying that the message was removed
   *
   * the user has the option to click an eyeball icon that will show the message
   */
  return (
    <Chat
      padTop={!message.deleted || deletedButShow}
      highlighted={highlighted}
      isEvent={isEvent()}
    >
      {message.deleted && !deletedButShow ? null : (
        <ChatUsername>{message.sender.displayname}</ChatUsername>
      )}
      {message.deleted && !deletedButShow ? null : (
        <ProfilePicture
          shadowColor={determineBoxShadow()}
          src={message.sender.avatar}
        />
      )}
      <ChatContent hidden={isSticker() || isSub() || isFollow() || isGift()}>
        {message.deleted && !deletedButShow
          ? getPhrase('chat_deleted')
          : message.content}
      </ChatContent>

      <StickerContent hidden={!isSticker()}>
        <AdvancedDiv 
          hoverStyle={stickerHoverStyle()}
          onHover={(e) => { setHoveringOnSticker(!!e); }}
          onClick={() => onAddStickerClick(message)}
          >
          <StickerContainer>
            {isHoveringOnSticker ? <StickerAddCircle> <FaPlus /> </StickerAddCircle> : null}
            <ChatSticker src={stickerUrl()} hidden={false} />
          </StickerContainer>
        </AdvancedDiv>
      </StickerContent>
      <FollowContent hidden={!isFollow()}>
        {getPhrase('just_followed')}
      </FollowContent>
      <GiftContent hidden={!isGift()}>{eventMessage()}</GiftContent>
      {message.deleted ? (
        <Icon
          style={{ position: 'absolute', right: '10px', top: '19px' }}
          onClick={updateShow}
        >
          {deletedButShow ? (
            <FaEye size={'18px'} />
          ) : (
            <FaEyeSlash size={'18px'} />
          )}
        </Icon>
      ) : null}
    </Chat>
  );
};
