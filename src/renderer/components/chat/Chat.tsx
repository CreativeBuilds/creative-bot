import * as React from 'react';
import styled from 'styled-components';
import {
  PageMain,
  PageTitle,
  PageContent
} from '../generic-styled-components/Page';
import { ChatInput } from './ChatInput';

interface IProps {}

/**
 * @description displays the chat page
 */
export const Chat = (props: IProps): React.ReactElement => {
  return (
    <PageMain>
      <PageTitle>Chat</PageTitle>
      <PageContent>
        This is chat screen
        <ChatInput />
      </PageContent>
    </PageMain>
  );
};
