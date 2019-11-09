import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../generic-styled-components/button';
import { ipcRenderer } from 'electron';
import { sendToMain } from '@/renderer/helpers/eventHandler';
import {
  PopupDialog,
  PopupDialogBackIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInput,
  PopupDialogInputInfo,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';

const LoginDliveStyled = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* font-size: 1.4em; */
  font-weight: 100;
  color: #f1f1f1;
  flex-direction: column;
`;

interface IProps {
  streamer?: boolean;
}

/**
 * @description this component is just for text to show the user while the node process recieves
 * the config from this page, and then senses that there is no authKey so it spawns a login page
 * (this creates a new electron window not on the main window)
 */
export const LoginDlive = ({ streamer }: IProps) => {
  const openLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    sendToMain('openLogin', {});
  };

  const openLoginStreamer = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    sendToMain('openLoginStreamer', {});
  };

  return (
    <LoginDliveStyled>
      <PopupDialog width={'350px'} minHeight={'300px'}>
        {!streamer ? (
          <React.Fragment>
            <PopupDialogTitle center>
              {getPhrase('connect_bot_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('connect_description')}
              <br />
              <br /> <b>{getPhrase('connect_warning')}</b>
            </PopupDialogText>
            <PopupButtonWrapper>
              <Button onClick={openLogin}>
                {getPhrase('connect_bot_button')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PopupDialogTitle center>
              {getPhrase('connect_streamer_title')}
            </PopupDialogTitle>
            <PopupDialogText style={{ marginBottom: '10px' }}>
              {getPhrase('connect_streamer_description')}
              <br />
              <br /> <b>{getPhrase('connect_streamer_warning')}</b>
            </PopupDialogText>
            <PopupButtonWrapper>
              <Button onClick={openLoginStreamer}>
                {getPhrase('connect_streamer_button')}
              </Button>
            </PopupButtonWrapper>
          </React.Fragment>
        )}
      </PopupDialog>
    </LoginDliveStyled>
  );
};
