import * as React from 'react';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { ChatInput } from './ChatInput';
import { getPhrase } from '@/renderer/helpers/lang';
import { FaUserAlt } from 'react-icons/fa';
import { Icon } from '../generic-styled-components/Icon';
import { ChatChangeAccounts } from './ChatChangeAccounts';
import { rxStoredMessages } from '@/renderer/helpers/rxChat';

import { reverse } from 'lodash';
import { ChatMessage } from './ChatMessage';
import styled from 'styled-components';
import { rxConfig, updateConfig } from '@/renderer/helpers/rxConfig';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import Select from 'react-select';
import { getSelf } from '@/renderer/helpers/dlive/getSelf';
import { shell } from 'electron';

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

const SelectWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: min-conent;
  padding-left: 10px;
  width: 170px;
  font-size: 1em !important;
  & > div {
    width: 160px;
    &:hover {
      cursor: pointer;
    }
  }
  [class*='-placeholder'],
  [class*='-singleValue'] {
    font-size: 0.8em !important;
  }
  [class*='-control'] {
    min-height: 33px;
    max-height: 33px;
  }
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
  color: #922cce;
  padding-left: 5px;
  text-decoration: underline;
`;

let AllMessages: IChatObject[] = [];

/**
 * @description displays the chat page
 */
export const Chat = ({ chat }: { chat: {}[] }): React.ReactElement => {
  const [userControlOverlay, setUserControlOverlay] = React.useState(false);
  const [messages, setMessages] = React.useState<IChatObject[]>([]);
  const [config, setConfig] = React.useState<Partial<IConfig>>({});
  const [botAccount, setBotAccount] = React.useState<IMe>();
  const [streamerAccount, setStreamerAccount] = React.useState<IMe>();
  const [selectedSender, setSelectSender] = React.useState<IOption>({
    value: 'bot',
    label: getPhrase('chat_select_send_bot')
  });

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
  /**
   * @description will try and trigger auto scroll to bottom
   */
  React.useEffect(() => {
    const el = document.getElementById('scroll-to');
    if (!el) {
      return console.log('no-el');
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
        filter((mConfig: Partial<IConfig>) => !!mConfig),
        distinctUntilChanged(
          (x, y) =>
            x.chatProfileShadows === y.chatProfileShadows &&
            x.selectedSender === y.selectedSender
        )
      )
      .subscribe((mConfig: Partial<IConfig>): void => {
        setConfig(mConfig);
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
    const listener = rxStoredMessages.subscribe(updateMessages);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const openUserControl = () => {
    setUserControlOverlay(true);
  };

  const closeUserControl = () => {
    setUserControlOverlay(false);
  };

  const openTab = () => {
    if (!streamerAccount || !streamerAccount.displayname) {
      return;
    }
    shell.openExternal(`https://dlive.tv/${streamerAccount.displayname}`);
  };

  return (
    <PageMain>
      <PageTitle>
        {getPhrase('chat_name')}{' '}
        <SelectWrap>
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
            menuPortalTarget={document.body}
            placeholder={getPhrase('chat_select_send_placeholder')}
            onChange={updateSelectSender}
            isSearchable={false}
          />
        </SelectWrap>
        <PageTitleRight>
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
              <ChatMessage
                highlighted={
                  !!streamerAccount
                    ? (message.content || '')
                        .toLowerCase()
                        .includes(streamerAccount.displayname.toLowerCase())
                    : false
                }
                key={message.id}
                message={message}
              />
            ))
          )}
          <ScrollTo id='scroll-to' />
        </ChatMessages>
        <ChatInput
          selectedSender={selectedSender}
          botAccount={
            !botAccount ? { username: '', displayname: '' } : botAccount
          }
          streamerAccount={
            !streamerAccount
              ? { username: '', displayname: '' }
              : streamerAccount
          }
          config={config}
        />
      </PageContent>
      {userControlOverlay ? (
        <ChatChangeAccounts closeUserControl={closeUserControl} />
      ) : null}
    </PageMain>
  );
};
