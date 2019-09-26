import * as React from 'react';
import { User } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogText,
  PopupButtonWrapper
} from '../generic-styled-components/PopupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';

interface IProps {
  user: User;
  closePopup: Function;
}

/**
 * @descritpion Edit user popup
 */
export const DeleteUserPopup = (props: IProps) => {
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  const deleteUser = () => {
    props.user.delete();
    props.closePopup();
  };

  return (
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
      <PopupDialogTitle>
        {getPhrase('users_delete_popup_title')} {props.user.displayname}?
      </PopupDialogTitle>
      <PopupDialogText style={{ paddingBottom: '60px' }}>
        {getPhrase('users_delete_popup_description')}
      </PopupDialogText>
      <PopupButtonWrapper>
        <Button onClick={deleteUser}>
          {getPhrase('users_delete_popup_confirm')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
