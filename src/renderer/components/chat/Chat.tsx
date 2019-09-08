import * as React from 'react';
import styled from 'styled-components';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { ChatInput } from './ChatInput';
import { getPhrase } from '@/renderer/helpers/lang';
import { FaUserAlt, FaTimes } from 'react-icons/fa';
import { Icon } from '../generic-styled-components/Icon';
import {
  PopupDialogBackground,
  PopupDialogTitle,
  PopupDialog,
  PopupDialogText,
  PopupButtonWrapper,
  PopupDialogExitIcon
} from '../generic-styled-components/PopupDialog';
import { Button } from '../generic-styled-components/Button';
import { ChatChangeAccounts } from './ChatChangeAccounts';

/**
 * @description displays the chat page
 */
export const Chat = ({ chat }: { chat: {}[] }): React.ReactElement => {
  const [userControlOverlay, setUserControlOverlay] = React.useState(false);

  const openUserControl = () => {
    setUserControlOverlay(true);
  };

  const closeUserControl = () => {
    setUserControlOverlay(false);
  };

  return (
    <PageMain>
      <PageTitle>
        {getPhrase('chat_name')}{' '}
        <PageTitleRight>
          <Icon onClick={openUserControl}>
            <FaUserAlt></FaUserAlt>
          </Icon>
        </PageTitleRight>
      </PageTitle>
      <PageContent>
        This is chat screen
        <ChatInput />
      </PageContent>
      {userControlOverlay ? (
        <ChatChangeAccounts closeUserControl={closeUserControl} />
      ) : null}
    </PageMain>
  );
};
