import * as React from 'react';
import styled from 'styled-components';
import {
  PopupDialogBackground,
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogInputWrapper,
  PopupDialogTabWrapper,
  PopupDialogTabHeaderWrapper,
  PopupDialogTab,
  PopupDialogTabPage
} from '../generic-styled-components/popupDialog';
import { FaTimes, FaSadTear, FaShare } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Emote } from '@/renderer/helpers/db/db';
import { EmoteItem } from '../generic-styled-components/Emote';
import { IOption, IMe, IConfig } from '@/renderer';
import { sendMessage } from '@/renderer/helpers/dlive/sendMessage';
import { Loading } from '../generic-styled-components/loading';
import { useEmotes } from '@/renderer/custom_hooks/useEmotes';

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
  // const emotes: Emote[] = [];
  // const loadingEmotes = true;
  const { emotes, loadingEmotes } = useEmotes();

  const isPage = (type: string): boolean => tab === type;

  const goToAll = () => {
    setTab('all');
  };

  const goToSaved = () => {
    setTab('saved');
  };

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
        }}>
        <PopupDialogExitIcon>
          <FaTimes onClick={close}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>{getPhrase('stickerlibrary_title')}</PopupDialogTitle>
        <PopupDialogTabWrapper>
          <PopupDialogTabHeaderWrapper>
            <PopupDialogTab
              onClick={isPage('saved') ? () => null : goToSaved}
              selected={isPage('saved')}>
              {getPhrase('stickerlibrary_tab_saved')}
            </PopupDialogTab>
          </PopupDialogTabHeaderWrapper>
        </PopupDialogTabWrapper>
        <PopupDialogTabPage>
          {isPage('saved') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <CollectionView>
                  {emotes.length > 0 ? (
                    emotes.map(emote => (
                      <EmoteItem
                        key={emote.id}
                        id={emote.id}
                        dliveId={emote.dliveid}
                        url={emote.url}
                        icon={<FaShare />}
                        canDelete={true}
                        onDelete={() => {
                          handleDelete(emote);
                        }}
                        onClick={() => {
                          sendMessageToStream(emote.dliveid);
                        }}
                      />
                    ))
                  ) : !loadingEmotes ? (
                    <NoStickerContainer>
                      <FaSadTear />
                      <h2>{getPhrase('stickerlibrary_warning_nostickers')}</h2>
                    </NoStickerContainer>
                  ) : (
                    <NoStickerContainer
                      style={{
                        display: 'flex',
                        flex: 1,
                        margin: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}>
                      <Loading />
                    </NoStickerContainer>
                  )}
                </CollectionView>
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : null}
        </PopupDialogTabPage>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
