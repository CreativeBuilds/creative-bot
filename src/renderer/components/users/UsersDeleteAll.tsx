import * as React from 'react';
import { User } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';

interface IProps {
  users: User[];
  closePopup(): void;
}

/**
 * @description popup to delete all the users
 */
export const UsersDeleteAll = (props: IProps) => {
  const { users } = props;
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  const deleteAllUsers = (): void => {
    users.forEach(user => {
      user.delete();
    });
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
        {getPhrase('users_delete_all_popup_title')}
      </PopupDialogTitle>
      <PopupDialogText style={{ paddingBottom: '60px' }}>
        {getPhrase('users_delete_all_popup_description')}
      </PopupDialogText>
      <PopupButtonWrapper>
        <Button onClick={deleteAllUsers} destructive>
          {getPhrase('users_delete_all_popup_confirm')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
