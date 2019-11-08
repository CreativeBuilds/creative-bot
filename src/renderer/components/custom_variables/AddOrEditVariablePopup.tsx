import * as React from 'react';
import { User, Command } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInput,
  PopupDialogInputInfo,
  PopupDialogPadding,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { rxCommands } from '@/renderer/helpers/rxCommands';
import {
  CustomVariable,
  rxCustomVariables
} from '@/renderer/helpers/rxCustomVariables';
import { map } from 'rxjs/operators';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

interface IProps {
  closePopup: Function;
  variable?: CustomVariable;
}

/**
 * @descritpion Edit user popup or Add user popup
 */
export const AddOrEditVariablePopup = (props: IProps) => {
  const [variableName, setVariableName] = React.useState(
    props.variable ? props.variable.name : ''
  );
  const [variableString, setVariableString] = React.useState(
    props.variable ? props.variable.replyString : ''
  );
  const [isEval, setIsEval] = React.useState(
    props.variable ? !!props.variable.isEval : false
  );

  const [variables, setVariables] = React.useState<{
    [id: string]: CustomVariable;
  }>({});

  /**
   * @description load all current commands and then store them in a map to check to see if the edit/added one already exists to throw error
   */
  React.useEffect(() => {
    const listener = rxCustomVariables.subscribe(setVariables);

    return () => listener.unsubscribe();
  }, []);

  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  /**
   * @description handles the creation of a new command, saves it, then closes the popup
   */
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newVariable = new CustomVariable(
      variableName,
      variableString,
      isEval
    );
    newVariable.save();
    props.closePopup();
  };

  /**
   * @description handles the edit of a command, saves, then closes the popup
   */
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const variable = props.variable;
    if (!variable) {
      return;
    }
    if (
      variableName === variable.name &&
      variableString === variable.replyString &&
      isEval === variable.isEval
    ) {
      return;
    }
    const newVariable = new CustomVariable(
      variableName,
      variableString,
      isEval
    );
    newVariable.save();
    props.closePopup();
  };

  /**
   * @description checks if the user can hit the submit button or not
   * changes based if the user is in edit or add mode
   */
  const canSubmit = () => {
    if (props.variable) {
      const variable = props.variable;
      if (!variable) {
        return false;
      }
      if (
        variableName === variable.name &&
        variableString === variable.replyString &&
        isEval === variable.isEval
      ) {
        return false;
      }
    }

    return variableString.length > 0 && variableName.length > 0;
  };

  const updateVariableName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableName(e.target.value);
  };

  const updateVariableString = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableString(e.target.value);
  };

  const updateIsEval = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEval(!isEval);
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
        {props.variable
          ? `${getPhrase('edit_variable_name')}, ${props.variable.name}`
          : getPhrase('new_variable_name')}
      </PopupDialogTitle>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_variable_name_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={variableName}
          onChange={updateVariableName}
          maxLength={16}
        />
        <PopupDialogInputInfo
          error={
            variableName.startsWith('!') ||
            (!!variables[variableName.toLowerCase()] &&
              (!!props.variable
                ? props.variable.name.toLowerCase() !==
                  variableName.toLowerCase()
                : true))
          }
        >
          {!!variables[variableName.toLowerCase()] &&
          (!!props.variable
            ? props.variable.name.toLowerCase() !== variableName.toLowerCase()
            : true)
            ? getPhrase('new_variable_name_error_exists')
            : getPhrase('new_variable_name_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_variable_reply_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={variableString}
          onChange={updateVariableString}
          maxLength={140}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_variable_reply_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_variable_isEval_title')}
        </PopupDialogInputName>
        <Toggle
          checked={isEval}
          icons={false}
          onChange={updateIsEval}
          className={'toggler'}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_variable_isEval_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupButtonWrapper>
        <Button
          disabled={!canSubmit()}
          onClick={
            canSubmit()
              ? props.variable
                ? handleEdit
                : handleCreate
              : () => null
          }
        >
          {props.variable
            ? getPhrase('edit_variable_submit')
            : getPhrase('new_variable_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
