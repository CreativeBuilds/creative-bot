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
import { FaTimes, FaHandMiddleFinger } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { Panel, PanelTitle, PanelSubtitle } from '../generic-styled-components/Panel'
import { Emote } from '@/renderer/helpers/db/db';
import { rxEmotes } from '@/renderer/helpers/rxEmote';
import { sendEvent } from '@/renderer/helpers/reactGA';

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

  const [emotes, setEmotes] = React.useState<{ [id: string]: Emote }>({});

  /**
   * @description load all current timers and then store them in a map to check to see if the edit/added one already exists to throw error
   */
  React.useEffect(() => {
    const listener = rxEmotes.subscribe((mEmotes: Emote[]) => {
      setEmotes(
        mEmotes.reduce((acc: { [id: string]: Emote }, emote: Emote) => {
          acc[emote.dliveid] = emote;

          return acc;
        }, {})
      );
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const stickerDliveId = (): string => {
    if (message?.content != null) {
      return message?.content;
    } else {
      return '';
    }
  }

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

  const cleanId = (): string => {
    if (message?.content != null) {
      var idStr = message?.content.replace(message?.content.substring(0, message?.content.indexOf(':')), '')
      console.log(idStr);
      return idStr;
    } else {
      return '';
    }
  }

  const getStickerId = (id: string): string => {
    var routes = id.replace(/[:]/gi, '').split('/');
    var imageRoute = routes[routes.length - 1];
    return imageRoute;
  };

  /**
   * @description handles the creation of a new Emote, saves it
   */
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newEmote = new Emote(
      getStickerId(cleanId()),
      stickerDliveId(),
      stickerUrl()
    );
    newEmote.save();
    //sendEvent('Emotes', 'new').catch(null);
    close();
  };

  const sendStickerToLibrary = () => {
    sendMessageToStream();
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
        <PopupDialogTitle>{getPhrase('addsticker_title')}</PopupDialogTitle>
        <PopupDialogInputWrapper>
          <StickerImage src={stickerUrl()}/>
        </PopupDialogInputWrapper>
        <PopupDialogInputWrapper>
          <Panel>
            <PanelTitle>{getPhrase('addsticker_title_stickerurl')}: </PanelTitle>
            <PanelSubtitle>{stickerUrl()}</PanelSubtitle>
          </Panel>
          <Panel>
            <PanelTitle>{getPhrase('addsticker_title_stickerid')}: </PanelTitle>
            <PanelSubtitle>{message?.content}</PanelSubtitle>
          </Panel>
        </PopupDialogInputWrapper>
        <PopupButtonWrapper>
          <Button onClick={() => sendStickerToLibrary()} inverted>
          {getPhrase('addsticker_button_sendsticker')}
          </Button>
          <Button onClick={handleCreate}>
          {getPhrase('addsticker_button_addtolibrary')}
          </Button>
        </PopupButtonWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
