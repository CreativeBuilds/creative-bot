import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import {
  SelectWrap,
  botSelectStyles
} from '../generic-styled-components/Select';
import { ChatInput } from './chatInput';
import { getPhrase } from '@/renderer/helpers/lang';
import { FaUserAlt, FaMicrophone, FaCommentAlt } from 'react-icons/fa';
import { Icon } from '../generic-styled-components/Icon';
import { ChatChangeAccounts } from './ChatChangeAccounts';
import { rxStoredMessages } from '@/renderer/helpers/rxChat';

import { reverse } from 'lodash';
import { ChatMessage } from './chatMessage';
import styled from 'styled-components';
import { rxConfig, updateConfig } from '@/renderer/helpers/rxConfig';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import Select from 'react-select';
import { getSelf } from '@/renderer/helpers/dlive/getSelf';
import { shell } from 'electron';
import { IConfig, IMe, IChatObject, IGiftObject , IOption } from '@/renderer';
import { ChatTTSSettings } from './chatTTSSettings';
import { ChatStickerLibrary } from './ChatStickerLibrary';
import { ChatAddStickerPopup } from './chatAddStickerPopup'

import {
  dropDownBoxBackgroundColor,
  dropDownBoxBorderColor,
  dropDownBoxHoverColor,
  dropDownBoxColor,
  dropDownBoxSelectedColor,
  accentColor,
  listItemColor,
  listItemAlternativeColor
} from '@/renderer/helpers/appearance';
import { ChatMessageSettings } from './chatMessageSettings';
import { Tracking } from '../tracking/tracking';

const ChatMessages = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > div {
    flex: 1;
  }
  overflow: auto;
  margin-bottom: 45px;
`;

const ScrollTo = styled.div`
  height: 0px;
  width: 0px;
  overflow: hidden;
`;

const CurrentlyConnected = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: min-content;
`;

const StyledA = styled.a`
  &:hover {
    cursor: pointer;
  }
  color: ${accentColor ? accentColor : '#922cce'};
  padding-left: 5px;
  text-decoration: underline;
`;

let AllMessages: IChatObject[] = [];

/**
 * @description displays the chat page
 */
export const Chat = ({ chat }: { chat: {}[] }): React.ReactElement => {
  const [userControlOverlay, setUserControlOverlay] = React.useState(false);
  const [ttsControlOverlay, setTTSControlOverlay] = React.useState(false);
  const [messageControl, setMessageControl] = React.useState(false);
  const [stickerLibraryOverlay, setStickerLibraryOverlay] = React.useState(false);
  const [addStickerOverlay, setAddStickerOverlay] = React.useState(false);
  const [messages, setMessages] = React.useState<IChatObject[]>([]);
  const [config, setConfig] = React.useState<Partial<IConfig>>({});
  const [botAccount, setBotAccount] = React.useState<IMe>();
  const [streamerAccount, setStreamerAccount] = React.useState<IMe>();
  const [selectedSender, setSelectSender] = React.useState<IOption>({
    value: 'bot',
    label: getPhrase('chat_select_send_bot')
  });
  const [message, setMessage] = React.useState<IChatObject | IGiftObject | undefined>();

  const updateSelectSender = (val: IOption) => {
    updateConfig({ selectedSender: val }).catch(console.error);
  };

  const updateMessages = (mChat: IChatObject) => {
    AllMessages = [mChat].concat(AllMessages);
    if (AllMessages.length > 100) {
      AllMessages.pop();
    }
    setMessages(AllMessages);
  };

  const DeleteMessage = (id: string) => {
    AllMessages = AllMessages.map(message => {
      return { ...message, ...(id === message.id ? { deleted: true } : {}) };
    });
    setMessages(AllMessages);
  };

  /**
   * @description will try and trigger auto scroll to bottom
   */
  React.useEffect(() => {
    const el = document.getElementById('scroll-to');
    if (!el) {
      return;
    }
    el.scrollIntoView();
  }, [messages]);

  /**
   * @description get the latest version of the selected shadow colors that display
   * behind the user profile picture in the chat screen and only update when those update
   */
  React.useEffect(() => {
    const listener = rxConfig
      .pipe(
        filter((mConfig: Partial<IConfig>) => !!mConfig)
        // distinctUntilChanged(
        //   (x, y) =>
        //     x.chatProfileShadows === y.chatProfileShadows &&
        //     x.selectedSender === y.selectedSender
        // )
      )
      .subscribe((mConfig: Partial<IConfig>): void => {
        setConfig(mConfig);
        if (
          !mConfig.allowedTTSDonations &&
          typeof mConfig.allowedTTSDonations === 'undefined'
        ) {
          updateConfig({
            ...mConfig,
            allowedTTSDonations: [
              { label: 'Ninjet', value: 'NINJET' },
              { label: 'Ninjaghini', value: 'NINJAGHINI' },
              { label: 'Diamond', value: 'DIAMOND' }
            ]
          }).catch(null);
        }
        if (
          !mConfig.hasTTSDonationMessages &&
          typeof mConfig.hasTTSDonationMessages === 'undefined'
        ) {
          updateConfig({
            ...mConfig,
            hasTTSDonationMessages: true
          });
        }
        if (!!mConfig.selectedSender) {
          setSelectSender(mConfig.selectedSender);
        }
        if (!!mConfig.streamerAuthKey) {
          getSelf(mConfig.streamerAuthKey)
            .then((me: IMe) => {
              setStreamerAccount(me);
            })
            .catch(null);
        }
        if (!!mConfig.authKey) {
          getSelf(mConfig.authKey)
            .then((me: IMe) => {
              setBotAccount(me);
            })
            .catch(null);
        }
      });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  /**
   * @description subscribe to the stored messages (will give up to the last 40 message events and
   * loop over them, triggering the updateMessages function each time)
   */
  React.useEffect(() => {
    AllMessages = [];
    const listener = rxStoredMessages.subscribe(message => {
      if (!message) {
        return;
      }
      if (message.type === 'Delete') {
        if (!message.ids) {
          return;
        }
        message.ids.forEach(id => {
          DeleteMessage(id);
        });
      } else {
        updateMessages(message);
      }
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const openUserControl = () => {
    setUserControlOverlay(true);
  };

  const openTTSControl = () => {
    setTTSControlOverlay(true);
  };

  const openStickerLibrary = () => {
    setStickerLibraryOverlay(true);
  };

  const openAddStickerPopup = (e?: IChatObject | IGiftObject) => {
    setAddStickerOverlay(true);
    setMessage(e);
  };

  const openMessageControl = () => {
    setMessageControl(true);
  };

  const closeUserControl = () => {
    setUserControlOverlay(false);
  };

  const closeTTSControl = () => {
    setTTSControlOverlay(false);
  };

  const closeStickerLibrary = () => {
    setStickerLibraryOverlay(false);
  };


  const closeAddStickerPopup = () => {
    setAddStickerOverlay(false);
  };

  const closeMessageControl = () => {
    setMessageControl(false);
  };

  const openTab = () => {
    if (!streamerAccount || !streamerAccount.displayname) {
      return;
    }
    shell.openExternal(`https://dlive.tv/${streamerAccount.displayname}`);
  };
 
  const isSticker = (message: IChatObject) => {
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

  return (
    <PageMain>
      <Tracking path='/chat' />
      <PageTitle>
        {getPhrase('chat_name')}{' '}
        <SelectWrap paddingLeft={'20px'}>
          <Select
            menuPlacement='bottom'
            options={[
              { value: 'bot', label: getPhrase('chat_select_send_bot') },
              {
                value: 'streamer',
                label: getPhrase('chat_select_send_streamer')
              }
            ]}
            value={selectedSender}
            menuPortalTarget={document.getElementById('app')}
            placeholder={getPhrase('chat_select_send_placeholder')}
            onChange={updateSelectSender}
            isSearchable={false}
            styles={botSelectStyles}
          />
        </SelectWrap>
        <PageTitleRight>
          <Icon onClick={openTTSControl} style={{ paddingRight: '10px' }}>
            <FaMicrophone></FaMicrophone>
          </Icon>
          <Icon onClick={openMessageControl} style={{ paddingRight: '10px' }}>
            <FaCommentAlt></FaCommentAlt>
          </Icon>
          <Icon onClick={openUserControl}>
            <FaUserAlt></FaUserAlt>
          </Icon>
        </PageTitleRight>
      </PageTitle>
      <PageContent style={{ padding: '0px' }}>
        <CurrentlyConnected>
          {!!streamerAccount ? (
            <React.Fragment>
              {`${getPhrase('chat_current_connected')}`}
              <StyledA onClick={openTab}>{streamerAccount.displayname}</StyledA>
            </React.Fragment>
          ) : (
            getPhrase(`chat_current_connected_failed`)
          )}
        </CurrentlyConnected>
        <ChatMessages>
          {reverse(
            messages.map(message => (   
              !isSticker(message) ? 
                <ChatMessage
                config={config}
                highlighted={
                  !!streamerAccount
                    ? (message.content || '')
                        .toLowerCase()
                        .includes(streamerAccount.displayname.toLowerCase())
                    : false
                }
                key={message.id}
                message={message}
                onAddStickerClick={openAddStickerPopup}
              /> : 
              config?.enableStickers ?
              <ChatMessage
              config={config}
              highlighted={
                !!streamerAccount
                  ? (message.content || '')
                      .toLowerCase()
                      .includes(streamerAccount.displayname.toLowerCase())
                  : false
              }
              key={message.id}
              message={message}
              onAddStickerClick={openAddStickerPopup}
            /> : 
            null         
            ))
          )}
          <ScrollTo id='scroll-to' />
        </ChatMessages>
        <ChatInput
          selectedSender={selectedSender}
          botAccount={
            !botAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : botAccount
          }
          streamerAccount={
            !streamerAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : streamerAccount
          }
          config={config}
          onStickerClick={() => { openStickerLibrary(); }}
        />
      </PageContent>
      {userControlOverlay ? (
        <ChatChangeAccounts closeUserControl={closeUserControl} />
      ) : null}
      {ttsControlOverlay ? (
        <ChatTTSSettings config={config} closeTTSControl={closeTTSControl} />
      ) : null}
      {stickerLibraryOverlay ? (
        <ChatStickerLibrary 
          selectedSender={selectedSender}
          botAccount={
            !botAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : botAccount
          }
          streamerAccount={
            !streamerAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : streamerAccount
          }
          config={config} 
          close={closeStickerLibrary} />
      ) : null}
      {addStickerOverlay ? (
        <ChatAddStickerPopup 
          message={message} 
          close={closeAddStickerPopup}
          selectedSender={selectedSender}
          botAccount={
            !botAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : botAccount
          }
          streamerAccount={
            !streamerAccount
              ? {
                  username: '',
                  displayname: '',
                  livestream: { createdAt: '0' }
                }
              : streamerAccount
          }
          config={config} />
      ) : null}
      {messageControl ? (
        <ChatMessageSettings
          config={config}
          closeMessageControl={closeMessageControl}
        />
      ) : null}
    </PageMain>
  );
};
