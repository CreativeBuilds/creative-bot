import * as React from 'react';
import { Command } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogPadding,
  PopupButtonWrapper
} from '../generic-styled-components/PopupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
interface IProps {
  command: Command;
  closePopup: Function;
}

/**
 * @descritpion Remove Command Popup
 */
export const RemoveCommandPopup = ({ closePopup, command }: IProps) => {
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    closePopup();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    command.delete();
    closePopup();
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
        {getPhrase('remove_command_name')}, <b>{command.name}</b>?
      </PopupDialogTitle>
      {getPhrase('remove_command_warning')}
      <PopupDialogPadding />
      <PopupButtonWrapper>
        <Button onClick={handleDelete} destructive>
          {getPhrase('remove_command_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
