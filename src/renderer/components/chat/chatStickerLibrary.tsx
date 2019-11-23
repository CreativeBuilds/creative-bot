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
import { FaTimes, FaSadTear } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { Emote } from '@/renderer/helpers/db/db';
import { rxEmotes } from '@/renderer/helpers/rxEmote';
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';


export const NoStickerContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    margin-top: 25%;
    margin-bottom: 10%;

    > svg {
        width: 96px;
        height: 96px;
        margin-left: auto;
        margin-right: auto;
        display: block;
     }

     h2 {
       
     }
`;

const StickerItem = styled.div`
    border-radius: 4px;
    display: block;

    img {
      max-height: 75px;
      max-width: 100%;
      border-radius: 4px;
    }
`;

const CollectionView = styled.div`
  display: grid;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px;
`;

/**
 * @description the popup for managing dlive accounts
 */
export const ChatStickerLibrary = ({
  closeStickerLibrary
}: {
  closeStickerLibrary(): void;
}) => {

  const [tab, setTab] = React.useState('saved');
  const [Emotes, setEmotes] = React.useState<Emote[]>([]);

  const isPage = (type: string): boolean => tab === type;

  const goToAll = () => {
    setTab('all');
  };

  const goToSaved = () => {
    setTab('saved');
  };

  /**
   * @description load all current timers and then store them in a map to check to see if the edit/added one already exists to throw error
   */
  React.useEffect(() => {
    const listener = rxEmotes.subscribe((mEmotes: Emote[]) => {
      setEmotes(
        mEmotes
      );

      console.log(mEmotes);
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const stickerHoverStyle = (): HoverStyle => {
    var style: HoverStyle = new HoverStyle();
    style.hasBorder = true;
    style.borderColor = '#ffffff';
    style.borderWidth = '2px';
    style.borderType = 'solid';
    style.borderRadius = '4px';
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
                    <CollectionView>
                      {Emotes.length > 0 ? Emotes.map(emote =>
                        <AdvancedDiv hoverStyle={stickerHoverStyle()} aStyle={{
                          'max-width': '75px',
                          'max-height': '75px',
                          'margin': '5px',
                          'display': 'inline-block'
                        }}
                        >
                          <StickerItem>
                            <img src={emote.url} />
                          </StickerItem>
                        </AdvancedDiv>
                      ) :
                      <NoStickerContainer>
                        <FaSadTear />
                        <h2>No Stickers</h2>
                      </NoStickerContainer>
                      }
                    </CollectionView>
                  </PopupDialogInputWrapper>
                </React.Fragment>
              ): null}
          </PopupDialogTabPage>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
