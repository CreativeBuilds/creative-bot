import * as React from 'react';
import styled from 'styled-components';
import { IChatColors, IChatObject } from '@/renderer';
import { getPhrase } from '@/renderer/helpers/lang';
import { Icon } from '../generic-styled-components/Icon';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

interface IChatProps {
  alternateBackground?: string;
  padTop?: boolean;
  highlighted?: boolean;
  highlightedBackground?: string;
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
  &:nth-child(even) {
    background: ${(props: IChatProps): string =>
      props.highlighted
        ? props.highlightedBackground
          ? props.highlightedBackground
          : '#922cce33'
        : props.alternateBackground
        ? props.alternateBackground
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

const ChatSticker = styled.img`
  padding-top: 2px;
  max-width: 60px;
  max-height: 60px;
`;

const ChatUsername = styled.div`
  position: absolute;
  top: 2px;
  left: 10px;
  font-size: 17px;
  border-bottom: 1px dashed;
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
  highlighted
}: {
  message: IChatObject;
  colors?: IChatColors;
  highlighted: boolean;
}) => {
  /**
   * @description state for when a message is deleted, the user has the option to check to see what the message was by clicking on the eyeball
   */
  const [deletedButShow, setDeletedButShow] = React.useState(false);

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

  const isSticker = () => {
    if (!message.content){
      return false;
    } else { 
      if (message.content.search(/^[:]emote/gi) >-1) {
        return true;
      } else{
        return false;  
      }
    };
  };


  const stickerUrl = (): string => {
    var stickerLink:string=''
    if (!message.content){
      return"";
    } else {
      var sticker = message.content;
      if (isSticker) {
        stickerLink = "https://images.prd.dlivecdn.com/emote/" + sticker.substring(sticker.lastIndexOf("/")+1, sticker.length-1);
      };
    };
    console.log("Sticker tag",sticker)
    console.log("StickerLink: ",stickerLink)
    return stickerLink; 
  };
    /**
   * @description will return a chat message row, if the message is deleted then it will show text
   * saying that the message was removed
   *
   * the user has the option to click an eyeball icon that will show the message
   */
  return (
    <Chat padTop={!message.deleted || deletedButShow} highlighted={highlighted}>
      {message.deleted && !deletedButShow ? null : (
        <ChatUsername>{message.sender.displayname}</ChatUsername>
      )}
      {message.deleted && !deletedButShow ? null : (
        <ProfilePicture
          shadowColor={determineBoxShadow()}
          src={message.sender.avatar}
        />
      )}
      <ChatContent 
        hidden={isSticker()}
       >
        {message.deleted && !deletedButShow
          ? getPhrase('chat_deleted')
          : message.content}
      </ChatContent>
      
      <StickerContent
        hidden={!isSticker()}
      >
        <ChatSticker 
          src={stickerUrl()}     
        />
</StickerContent>
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
