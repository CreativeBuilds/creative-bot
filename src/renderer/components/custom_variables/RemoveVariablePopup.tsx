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
import { CustomVariable } from '@/renderer/helpers/rxCustomVariables';
interface IProps {
  variable: CustomVariable;
  closePopup: Function;
}

/**
 * @descritpion Remove Variable Popup
 */
export const RemoveVariablePopup = ({ closePopup, variable }: IProps) => {
  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    closePopup();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    variable.delete();
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
        {getPhrase('remove_variable_name')}, <b>{variable.name}</b>?
      </PopupDialogTitle>
      {getPhrase('remove_variable_warning')}
      <PopupDialogPadding />
      <PopupButtonWrapper>
        <Button onClick={handleDelete} destructive>
          {getPhrase('remove_variable_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
