import * as React from 'react';
import styled from 'styled-components';
import {
  PopupDialogBackground,
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupButtonWrapper,
  PopupDialogInputWrapper,
  PopupDialogInputInfo,
  PopupDialogInputName,
  PopupDialogTabWrapper,
  PopupDialogTabHeaderWrapper,
  PopupDialogTab,
  PopupDialogTabPage,
  PopupDialogInput
} from '../generic-styled-components/popupDialog';
import { IChatColors, IChatObject, IGiftObject, IOption, IMe, IConfig } from '@/renderer';
import { sendMessage } from '@/renderer/helpers/dlive/sendMessage';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';
import { Panel, PanelTitle, PanelSubtitle } from '../generic-styled-components/Panel'

export const StickerImage = styled.img`
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 1px 1px 21px 1px black;
    margin-bottom: 10px;
    height: 170px;
`;

/**
 * @description the popup for managing dlive accounts
 */
export const ChatAddStickerPopup = ({
  close,
  selectedSender,
  config,
  botAccount,
  streamerAccount,
  message
}: {
    message: IChatObject | IGiftObject | undefined
    selectedSender: IOption;
    config: Partial<IConfig>;
    botAccount: IMe;
    streamerAccount: IMe;
    close: () => void;
}) => {

  const stickerUrl = (): string => {
    var stickerLink: string = '';
    if (!message?.content) {
      return '';
    } else {
      var sticker = message?.content;
      stickerLink =
          'https://images.prd.dlivecdn.com/emote/' +
          sticker.substring(sticker.lastIndexOf('/') + 1, sticker.length - 1);
    }
    return stickerLink;
  };

  const sendStickerToLibrary = () => {
    sendMessageToStream();
    close();
  };

  const addStickerToLibrary = () => {
    close();
  };

  const sendMessageToStream = (): void => {
    const currentSelected = selectedSender.value;
    if (!config.streamerAuthKey || !config.authKey) {
      return;
    }
    sendMessage(
      currentSelected === 'streamer' ? config.streamerAuthKey : config.authKey,
      {
        message: message?.content ? message?.content : '',
        roomRole: currentSelected === 'streamer' ? 'Owner' : 'Member',
        streamer: streamerAccount.username,
        subscribing: true
      }
    ).catch(null);
  };

  return (
    <PopupDialogBackground>
      <PopupDialog
        style={{
          height: 'min-content',
          minHeight: 'min-content',
          width: '425px',
          minWidth: '425px'
        }}
      >
        <PopupDialogExitIcon>
          <FaTimes onClick={close}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>Add Sticker </PopupDialogTitle>
        <PopupDialogInputWrapper>
          <StickerImage src={stickerUrl()}/>
        </PopupDialogInputWrapper>
        <PopupDialogInputWrapper>
          <Panel>
            <PanelTitle>Sticker URL: </PanelTitle>
            <PanelSubtitle>{stickerUrl()}</PanelSubtitle>
          </Panel>
          <Panel>
            <PanelTitle>Sticker ID: </PanelTitle>
            <PanelSubtitle>{message?.content}</PanelSubtitle>
          </Panel>
        </PopupDialogInputWrapper>
        <PopupButtonWrapper>
          <Button onClick={() => sendStickerToLibrary()} inverted>
            Send Sticker
          </Button>
          <Button onClick={() => addStickerToLibrary()}>
            Add To Library
          </Button>
        </PopupButtonWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
