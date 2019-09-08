import * as React from 'react';
import styled from 'styled-components';

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

  return (
    <Chat padTop highlighted={highlighted}>
      <ChatUsername>{message.sender.displayname}</ChatUsername>
      <ProfilePicture
        shadowColor={determineBoxShadow()}
        src={message.sender.avatar}
      />
      <ChatContent>{message.content}</ChatContent>
    </Chat>
  );
};
