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
import { FaTimes, FaSadTear, FaShare, FaGrinBeam  } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { Emote } from '@/renderer/helpers/db/db';
import { rxEmotes } from '@/renderer/helpers/rxEmote';
import { AdvancedDiv, HoverStyle } from '../generic-styled-components/AdvancedDiv';
import { EmoteItem } from '../generic-styled-components/Emote';
import { sendEvent } from '@/renderer/helpers/reactGA';
import { IChatColors, IChatObject, IGiftObject, IOption, IMe, IConfig } from '@/renderer';
import { sendMessage } from '@/renderer/helpers/dlive/sendMessage';


export const NoStickerContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    margin-top: 35%;
    margin-bottom: 10%;

    > svg {
        width: 96px;
        height: 96px;
        margin-left: auto;
        margin-right: auto;
        display: block;
     }

     h2 {
      text-align: center;
     }
`;

const CollectionView = styled.div`
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 400px;
`;

/**
 * @description the popup for managing dlive accounts
 */
export const ChatStickerLibrary = ({
  selectedSender,
  config,
  botAccount,
  streamerAccount,
  close
}: {
  selectedSender: IOption;
  config: Partial<IConfig>;
  botAccount: IMe;
  streamerAccount: IMe;
  close(): void;
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
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const sendMessageToStream = (sticker: string): void => {
    const currentSelected = selectedSender.value;
    if (!config.streamerAuthKey || !config.authKey) {
      return;
    }
    sendMessage(
      currentSelected === 'streamer' ? config.streamerAuthKey : config.authKey,
      {
        message: sticker,
        roomRole: currentSelected === 'streamer' ? 'Owner' : 'Member',
        streamer: streamerAccount.username,
        subscribing: true
      }
    ).catch(null);

    close();
  };

  const handleDelete = (e: Emote) => {
    e.delete();
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
                        <EmoteItem 
                          key={emote.id}
                          id={emote.id} 
                          dliveId={emote.dliveid} 
                          url={emote.url}
                          icon={<FaShare />} 
                          hasBorder={true} 
                          canDelete={true} 
                          onDelete={() => { handleDelete(emote); }} 
                          onClick={() => { sendMessageToStream(emote.dliveid); }}
                        />
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
