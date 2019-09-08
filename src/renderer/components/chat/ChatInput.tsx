import * as React from 'react';
import styled from 'styled-components';
import { FaShare } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
import Select from 'react-select';
import { sendMessage } from '@/renderer/helpers/dlive/sendMessage';
import { getSelf } from '@/renderer/helpers/dlive/getSelf';

const ChatInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;

  height: 50px;
`;

interface IChatInputStyled {
  hoverShadow?: string;
}

const ChatInputStyled = styled.input`
  flex: 3;
  position: absolute;
  bottom: 0;
  left: 0;
  border: 0px;
  outline: none !important;
  height: 25px;
  width: -webkit-fill-available;
  padding: 10px;
  padding-right: 60px;
  font-size: 1em;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease-in-out;
  &:active,
  &:focus,
  &:hover {
    box-shadow: 0px -2px 4px ${(props: IChatInputStyled): string => (props.hoverShadow ? props.hoverShadow : 'rgba(0, 0, 0, 0.15)')};
  }
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
`;

interface IChatInputSend {
  color?: string;
  colorHover?: string;
  disabled?: boolean;
  disabledColor?: string;
}
const ChatInputSend = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;

  width: 50px;
  height: 45px;

  &:hover {
    cursor: ${(props: IChatInputSend): string =>
      props.disabled ? 'unset' : 'pointer'};
    & > svg {
      filter: ${(props: IChatInputSend): string =>
        props.disabled
          ? 'unset'
          : 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))'};
      color: ${(props: IChatInputSend): string =>
        props.disabled
          ? props.disabledColor
            ? props.disabledColor
            : '#ccc'
          : props.colorHover
          ? props.colorHover
          : props.color
          ? props.color
          : 'inherit'};
    }
  }
  & > svg {
    font-size: 30px;
    height: 30px;
    width: 30px;
    color: ${(props: IChatInputSend): string =>
      props.disabled
        ? props.disabledColor
          ? props.disabledColor
          : '#ccc'
        : props.color
        ? props.color
        : 'inherit'};
    transition: all 0.15s ease-in;
  }
`;

const ChatInputSelect = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 45px;
  left: 0;
  width: 210px;
  overflow: hidden;
  height: 50px;
  /* box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.15); */
  background: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  & > div {
    width: 200px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  }
`;

/**
 *
 * @description the chat input on the bottom of the chat screen
 */
export const ChatInput = ({
  selectedSender,
  config,
  botAccount,
  streamerAccount
}: {
  selectedSender: IOption;
  config: Partial<IConfig>;
  botAccount: IMe;
  streamerAccount: IMe;
}): React.ReactElement => {
  const [text, setText] = React.useState('');

  const updateText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const sendMessageToStream = (): void => {
    const currentSelected = selectedSender.value;
    if (!config.streamerAuthKey || !config.authKey) {
      return console.log('RETURNING NO CONFIG SHIT FOUND', config);
    }
    sendMessage(
      currentSelected === 'streamer' ? config.streamerAuthKey : config.authKey,
      {
        message: text,
        roomRole: currentSelected === 'streamer' ? 'Owner' : 'Member',
        streamer: streamerAccount.username,
        subscribing: true
      }
    ).catch(console.error);
    // sendMessage()
    setText('');
  };

  return (
    <React.Fragment>
      {/* <ChatInputSelect>
        
      </ChatInputSelect> */}
      <ChatInputWrapper>
        <ChatInputStyled
          hoverShadow={'rgba(223, 30, 191, 0.15)'}
          placeholder={getPhrase('chat_send')}
          value={text}
          onChange={updateText}
        />
        <ChatInputSend
          disabled={text.length === 0}
          color={'#df1ebfcc'}
          colorHover={'#df1ebf'}
        >
          <FaShare onClick={sendMessageToStream} />
        </ChatInputSend>
      </ChatInputWrapper>
    </React.Fragment>
  );
};
