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
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';

/**
 * @description the popup for managing dlive accounts
 */
export const ChatStickerLibrary = ({
  closeStickerLibrary
}: {
  closeStickerLibrary(): void;
}) => {

  const [tab, setTab] = React.useState('saved');

  const isPage = (type: string): boolean => tab === type;

  const goToAll = () => {
    setTab('all');
  };

  const goToSaved = () => {
    setTab('saved');
  };

  const stickerHoverStyle = (): HoverStyle => {
    var style: HoverStyle = new HoverStyle();
    style.hasBorder = false;
    style.borderColor = '#ffffff';
    style.borderWidth = '2px';
    style.borderType = 'solid';
    style.borderRadius = '0px';
    style.cursor = 'pointer';
    return style;
  }

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
              onClick={isPage('saved') ? () => null : goToSaved}
              selected={isPage('saved')}
            >
              Saved
            </PopupDialogTab>
          </PopupDialogTabHeaderWrapper>
        </PopupDialogTabWrapper>
        <PopupDialogTabPage>
            {isPage('saved') ? (
                <React.Fragment>
                  <PopupDialogInputWrapper>
                      <AdvancedDiv hoverStyle={stickerHoverStyle()}>
                        <div style={{width: '64px', height: '64px', backgroundColor: '#ff0000' }}>

                        </div>
                      </AdvancedDiv>
                  </PopupDialogInputWrapper>
                </React.Fragment>
              ): null}
          </PopupDialogTabPage>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
