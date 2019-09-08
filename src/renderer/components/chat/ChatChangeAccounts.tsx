import * as React from 'react';
import {
  PopupDialogBackground,
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupButtonWrapper
} from '../generic-styled-components/PopupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
import { updateConfig } from '@/renderer/helpers/rxConfig';

/**
 * @description the popup for managing dlive accounts
 */
export const ChatChangeAccounts = ({
  closeUserControl
}: {
  closeUserControl(): void;
}) => {
  const updateStreamer = (): void => {
    updateConfig({ streamerAuthKey: null }).catch(null);
  };

  const updateBot = (): void => {
    updateConfig({ authKey: null }).catch(null);
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
          <FaTimes onClick={closeUserControl}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>{getPhrase('chat_change_title')}</PopupDialogTitle>
        <PopupDialogText style={{ marginBottom: '60px' }}>
          {getPhrase('chat_change_description')}
        </PopupDialogText>
        <PopupButtonWrapper>
          <Button onClick={updateStreamer} inverted>
            {getPhrase('chat_change_streamer_button')}
          </Button>
          <Button onClick={updateBot}>
            {getPhrase('chat_change_bot_button')}
          </Button>
        </PopupButtonWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
