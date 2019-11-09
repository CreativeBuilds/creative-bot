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
  PopupDialogInputName
} from '../generic-styled-components/popupDialog';
import { SelectWrap, selectStyles } from '../generic-styled-components/Select';
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
export const ChatTTSSettings = ({
  config,
  closeTTSControl
}: {
  config: Partial<IConfig>;
  closeTTSControl(): void;
}) => {
  const [hasTTSDonations, setHasTTSDonations] = React.useState<boolean>(
    !!config.hasTTSDonations
  );
  const [hasTTSDonationMessages, setHasTTSDonationMessages] = React.useState<
    boolean
  >(!!config.hasTTSDonationMessages);
  const [allowedTTSDonations, setAllowedTTSDonations] = React.useState<
    ISelectOption<'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'>[]
  >(config.allowedTTSDonations ? config.allowedTTSDonations : []);

  React.useEffect(() => {
    setHasTTSDonations(!!config.hasTTSDonations);

    setAllowedTTSDonations(
      config.allowedTTSDonations ? config.allowedTTSDonations : []
    );
  }, [config]);

  const updateAllowedTTSDonations = (
    e: ISelectOption<
      'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'
    >[]
  ) => {
    updateConfig({ ...config, allowedTTSDonations: e }).catch(null);
  };

  const updateHasTTSDonations = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...config, hasTTSDonations: !config.hasTTSDonations }).catch(
      null
    );
  };

  const updateHasTTSDonationMeessages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateConfig({
      ...config,
      hasTTSDonationMessages: !config.hasTTSDonationMessages
    }).catch(null);
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
          <FaTimes onClick={closeTTSControl}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>{getPhrase('chat_tts_title')}</PopupDialogTitle>
        <PopupDialogInputWrapper>
          <PopupDialogInputName>
            {getPhrase('chat_tts_enable')}
          </PopupDialogInputName>
          <Toggle
            checked={hasTTSDonations}
            icons={false}
            onChange={updateHasTTSDonations}
            className={'toggler'}
          />
          <PopupDialogInputInfo>
            {getPhrase('chat_tts_enable_info')}
          </PopupDialogInputInfo>
        </PopupDialogInputWrapper>
        <PopupDialogInputWrapper>
          <PopupDialogInputName>
            {getPhrase('chat_tts_message')}
          </PopupDialogInputName>
          <Toggle
            checked={hasTTSDonationMessages}
            icons={false}
            onChange={updateHasTTSDonationMeessages}
            className={'toggler'}
          />
          <PopupDialogInputInfo>
            {getPhrase('chat_tts_message_info')}
          </PopupDialogInputInfo>
        </PopupDialogInputWrapper>
        <PopupDialogInputWrapper>
          <PopupDialogInputName>
            {getPhrase('chat_tts_options')}
          </PopupDialogInputName>
          <SelectWrap width={'100%'}>
            <Select
              styles={selectStyles}
              value={allowedTTSDonations}
              isMulti={true}
              onChange={updateAllowedTTSDonations}
              menuPortalTarget={document.body}
              options={[
                { label: 'Lemon', value: 'LEMON' },
                { label: 'Ice Cream', value: 'ICE_CREAM' },
                { label: 'Diamond', value: 'DIAMOND' },
                { label: 'Ninjaghini', value: 'NINJAGHINI' },
                { label: 'Ninjet', value: 'NINJET' }
              ]}
              isDisabled={!hasTTSDonations}
            />
          </SelectWrap>
          <PopupDialogInputInfo>
            {getPhrase('chat_tts_options_info')}
          </PopupDialogInputInfo>
        </PopupDialogInputWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
