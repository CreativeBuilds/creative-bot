import * as React from 'react';
import { Timer } from '@/renderer/helpers/db/db';
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
  timer: Timer;
  closePopup: Function;
}

/**
 * @descritpion Remove Timer Popup
 */
export const RemoveTimerPopup = ({ closePopup, timer }: IProps) => {
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    closePopup();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    timer.delete();
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
        {getPhrase('remove_timer_name')}, <b>{timer.name}</b>?
      </PopupDialogTitle>
      {getPhrase('remove_timer_warning')}
      <PopupDialogPadding />
      <PopupButtonWrapper>
        <Button onClick={handleDelete} destructive>
          {getPhrase('remove_timer_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
