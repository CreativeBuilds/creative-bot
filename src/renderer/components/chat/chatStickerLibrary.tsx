import * as React from 'react';
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
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';

/**
 * @description the popup for managing dlive accounts
 */
export const ChatStickerLibrary = ({
  closeStickerLibrary
}: {
  closeStickerLibrary(): void;
}) => {

  const [tab, setTab] = React.useState('all');

  const isPage = (type: string): boolean => tab === type;

  const goToAll = () => {
    setTab('all');
  };

  const goToSaved = () => {
    setTab('saved');
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
          <FaTimes onClick={closeStickerLibrary}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>Sticker Library</PopupDialogTitle>
        <PopupDialogTabWrapper>
          <PopupDialogTabHeaderWrapper>
            <PopupDialogTab 
              onClick={isPage('all') ? () => null : goToAll}
              selected={isPage('all')}
            >
              All
            </PopupDialogTab>
            <PopupDialogTab 
              onClick={isPage('saved') ? () => null : goToSaved}
              selected={isPage('saved')}
            >
              Saved
            </PopupDialogTab>
          </PopupDialogTabHeaderWrapper>
        </PopupDialogTabWrapper>
        <PopupDialogTabPage>
            {isPage('all') ? (
              <React.Fragment>
                <PopupDialogInputWrapper>
                    This Test
                </PopupDialogInputWrapper>
              </React.Fragment>
            ): 
            isPage('saved') ? (
                <React.Fragment>
                  <PopupDialogInputWrapper>
                      This Test
                  </PopupDialogInputWrapper>
                </React.Fragment>
              ): null}
          </PopupDialogTabPage>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
