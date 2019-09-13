import * as React from 'react';
import { User } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon
} from '../generic-styled-components/PopupDialog';
import { FaTimes } from 'react-icons/fa';

interface IProps {
  user: User;
  closePopup: Function;
}

/**
 * @descritpion Edit user popup
 */
export const UserPopup = (props: IProps) => {
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
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
      <PopupDialogTitle>{props.user.displayname}</PopupDialogTitle>
    </PopupDialog>
  );
};
