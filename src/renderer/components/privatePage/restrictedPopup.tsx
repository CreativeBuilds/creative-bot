import * as React from 'react';
import {
  PopupDialogBackground,
  PopupDialogTitle,
  PopupDialog,
  PopupDialogText,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { Button } from '../generic-styled-components/button';
import { getPhrase } from '@/renderer/helpers/lang';

/**
 * @description Shows the restricted popup telling users its a premium only page
 */
export const RestrictedPopup = () => {
  const purchasePremium = () => {
    console.log('GOING TO PREMIUM');
  };

  return (
    <PopupDialogBackground>
      <PopupDialog>
        <PopupDialogTitle>{getPhrase('premium_title')}</PopupDialogTitle>
        <PopupDialogText>{getPhrase('premium_text')}</PopupDialogText>
        <PopupButtonWrapper>
          <Button onClick={purchasePremium}>
            {getPhrase('premium_call_to_action')}
          </Button>
        </PopupButtonWrapper>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
