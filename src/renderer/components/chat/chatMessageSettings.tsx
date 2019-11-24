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
import { IConfig, ISelectOption } from '@/renderer';
import Select from 'react-select';
import { updateConfig } from '@/renderer/helpers/rxConfig';
import Toggle from 'react-toggle';

/**
 * @description the popup for managing dlive accounts
 */
export const ChatMessageSettings = ({
  config,
  closeMessageControl
}: {
  config: Partial<IConfig>;
  closeMessageControl(): void;
}) => {
  const [tab, setTab] = React.useState('donations');

  const [eventConfig, setEventConfig] = React.useState<IConfig['eventConfig']>({
    enableDebounceEvents: true,
    enableEventMessages: false,
    onDiamond: 'Thank you for the diamond $USER!',
    onFollow: 'Thank you for the follow $USER!',
    onGiftedSub: 'Thank you for gifting a sub, $USER!',
    onIcecream: 'Thank you for the icecream $USER!',
    onLemon: 'Thanks for the lemon $USER!',
    onNinja: '*smoke bomb* Thanks for that Ninjaghini $USER!',
    onNinjet: `Holy smokes! You're the best $USER! 😲 Thanks for that ninjet!`,
    onSub: 'Thank you for subscribing $USER!',
    ...config.eventConfig
  });
  const [sendEventMessages, setSendEventMessages] = React.useState(
    !!eventConfig ? eventConfig.enableEventMessages : false
  );
  const [lemonMessage, setLemonMessage] = React.useState(
    !!eventConfig ? eventConfig.onLemon : 'Thanks for the lemon $USER!'
  );
  const [icecreamMessage, setIcecreamMessage] = React.useState(
    !!eventConfig ? eventConfig.onIcecream : 'Thank you for the icecream $USER!'
  );
  const [diamondMessage, setDiamondMessage] = React.useState(
    !!eventConfig ? eventConfig.onDiamond : 'Thank you for the diamond $USER!'
  );
  const [ninjaMessage, setNinjaMessage] = React.useState(
    !!eventConfig
      ? eventConfig.onNinja
      : '*smoke bomb* Thanks for that Ninjaghini $USER!'
  );
  const [ninjetMessage, setNinjetMessage] = React.useState(
    !!eventConfig
      ? eventConfig.onNinjet
      : `Holy smokes! You're the best $USER! 😲 Thanks for that ninjet!`
  );
  const [followMessage, setFollowMessage] = React.useState(
    !!eventConfig
      ? eventConfig.onFollow
      : 'Thank you for the follow $USER!'
  );
  const [subMessage, setSubMessage] = React.useState(
    !!eventConfig
      ? eventConfig.onSub
      : 'Thank you for subscribing $USER!'
  );
  const [giftedSubMessage, setGiftedSubMessage] = React.useState(
    !!eventConfig
      ? eventConfig.onGiftedSub
      : 'Thank you for gifting a sub, $USER!'
  );

  React.useEffect(() => {
    setSendEventMessages(
      eventConfig?.enableEventMessages
    );
  }, [eventConfig]);

  React.useEffect(() => {
    setEventConfig({
      enableDebounceEvents: true,
      enableEventMessages: false,
      onDiamond: 'Thank you for the diamond $USER!',
      onFollow: 'Thank you for the follow $USER!',
      onGiftedSub: 'Thank you for gifting a sub, $USER!',
      onIcecream: 'Thank you for the icecream $USER!',
      onLemon: 'Thanks for the lemon $USER!',
      onNinja: '*smoke bomb* Thanks for that Ninjaghini $USER!',
      onNinjet:
        "Holy smokes! You're the best $USER! 😲 Thanks for that ninjet!",
      onSub: 'Thank you for subscribing $USER!',
      ...config.eventConfig
    });
  }, [config]);

  const isPage = (type: string): boolean => tab === type;

  const goToDonations = () => {
    setTab('donations');
  };

  const goToOther = () => {
    setTab('other');
  }

  const goToConfigs = () => {
    setTab('configs');
  }

  const updateSendEventMessages = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      ...config,
      eventConfig: {
        ...eventConfig,
        enableEventMessages: !(eventConfig?.enableEventMessages)
      }
    }).catch(console.error);
  };

  const updateLemonMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLemonMessage(e.target.value);
  };

  const updateIcecreamMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcecreamMessage(e.target.value);
  };

  const updateDiamondMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiamondMessage(e.target.value);
  };

  const updateNinjaMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNinjaMessage(e.target.value);
  };

  const updateNinjetMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNinjetMessage(e.target.value);
  };

  const updateFollowMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFollowMessage(e.target.value);
  };

  const updateSubMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubMessage(e.target.value);
  };

  const updateGiftedSubMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGiftedSubMessage(e.target.value);
  };

  const hasChanged = (): boolean => {
    return lemonMessage !== eventConfig?.onLemon || icecreamMessage !== eventConfig?.onIcecream || diamondMessage !== eventConfig?.onDiamond || ninjaMessage !== eventConfig?.onNinja || ninjetMessage !== eventConfig?.onNinjet || followMessage !== eventConfig?.onFollow || subMessage !== eventConfig?.onSub || giftedSubMessage !== eventConfig?.onGiftedSub;
  };

  const saveSettings = () => {
    updateConfig({...config, eventConfig: {
      ...eventConfig,
      onDiamond: diamondMessage,
      onFollow: followMessage,
      onGiftedSub: giftedSubMessage,
      onIcecream: icecreamMessage,
      onLemon: lemonMessage,
      onNinja: ninjaMessage,
      onNinjet: ninjetMessage,
      onSub: subMessage
    }}).catch(null);
  };

  return (
    <PopupDialogBackground>
      <PopupDialog
        style={{
          height: 'min-content',
          maxHeight: '85vh',
          width: '425px',
          minWidth: '425px',
          overflow: 'auto'
        }}
      >
        <PopupDialogExitIcon>
          <FaTimes onClick={closeMessageControl}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>
          {getPhrase('chat_custom_messages_title')}
        </PopupDialogTitle>
        <PopupDialogInputWrapper>
          <PopupDialogInputName>
            {getPhrase('chat_custom_messages_donations_toggle')}
          </PopupDialogInputName>
          <Toggle
            checked={sendEventMessages}
            icons={false}
            onChange={updateSendEventMessages}
            className={'toggler'}
          />
          <PopupDialogInputInfo>
            {getPhrase('chat_custom_messages_donations_toggle_info')}
          </PopupDialogInputInfo>
        </PopupDialogInputWrapper>
        <PopupDialogTabWrapper>
          <PopupDialogTabHeaderWrapper>
            <PopupDialogTab 
              onClick={isPage('donations') ? () => null : goToDonations}
              selected={isPage('donations')}
            >
              {getPhrase('chat_custom_messages_donations')}
            </PopupDialogTab>
            <PopupDialogTab
              onClick={isPage('other') ? () => null : goToOther}
              selected={isPage('other')}
            >
              {getPhrase('chat_custom_messages_other')}
            </PopupDialogTab>
            <PopupDialogTab
              onClick={isPage('configs') ? () => null : goToConfigs}
              selected={isPage('configs')}
            >
              Config
            </PopupDialogTab>
          </PopupDialogTabHeaderWrapper>
        </PopupDialogTabWrapper>
        <PopupDialogTabPage>
          {isPage('donations') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_donations_lemon')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={lemonMessage}
                  onChange={updateLemonMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_donations_icecream')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={icecreamMessage}
                  onChange={updateIcecreamMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_donations_diamond')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={diamondMessage}
                  onChange={updateDiamondMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_donations_ninja')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={ninjaMessage}
                  onChange={updateNinjaMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_donations_ninjet')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={ninjetMessage}
                  onChange={updateNinjetMessage}
                />
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : isPage('other') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_other_follow')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={followMessage}
                  onChange={updateFollowMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_other_gifted')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={giftedSubMessage}
                  onChange={updateGiftedSubMessage}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('chat_custom_messages_other_sub')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={subMessage}
                  onChange={updateSubMessage}
                />
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : isPage('configs') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  Enable Stickers
                </PopupDialogInputName>
                <Toggle
                  checked={true}
                  icons={false}
                  onChange={() => {}}
                  className={'toggler'}
                />
                <PopupDialogInputInfo>
                  Enable or Disable stickers in chat
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  Enable Stickers as Text
                </PopupDialogInputName>
                <Toggle
                  checked={false}
                  icons={false}
                  onChange={() => {}}
                  className={'toggler'}
                />
                <PopupDialogInputInfo>
                  Allows the ability to display Stickers as Text in Chat
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  Enable Events In Chat
                </PopupDialogInputName>
                <Toggle
                  checked={true}
                  icons={false}
                  onChange={() => {}}
                  className={'toggler'}
                />
                <PopupDialogInputInfo>
                  Allows the ability to display Events like Donations in Chat
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : null}
        </PopupDialogTabPage>
        <PopupButtonWrapper>
          <Button
            disabled={!hasChanged()}
            
            onClick={hasChanged() ? saveSettings : () => null}
            style={{ zIndex: 4, position: 'static', marginTop: '10px' }}
          >
            {getPhrase('chat_custom_messages_save')}
          </Button>
        </PopupButtonWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};