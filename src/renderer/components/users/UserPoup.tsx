import * as React from 'react';
import { User } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogTabWrapper,
  PopupDialogTabHeaderWrapper,
  PopupDialogTab,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInput,
  PopupDialogTabPage,
  PopupButtonWrapper
} from '../generic-styled-components/popupDialog';
import { SelectWrap } from '../generic-styled-components/Select'
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import Select from 'react-select';

interface IProps {
  user: User;
  closePopup: Function;
}

/**
 * @descritpion Edit user popup
 */
export const UserPopup = (props: IProps) => {
  const user = props.user;

  const convertLino = (mLino: number) => Math.floor(mLino / 10000) * 10;

  const [tab, setTab] = React.useState<string>('info');
  const [points, setPoints] = React.useState<number | string>(user.points);
  const [lino, setLino] = React.useState<number | string>(
    convertLino(user.lino)
  );

  const hasChanged = (): boolean => {
    return (
      Number(points) !== user.points || Number(lino) !== convertLino(user.lino)
    );
  };

  const validatePoints = () => {
    const Points = Number(points);
    if (isNaN(Points)) {
      return false;
    }

    return true;
  };
  const validateLino = () => {
    const Lino = Number(lino);
    if (isNaN(Lino)) {
      return false;
    }

    return true;
  };

  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  const goToInfo = () => {
    setTab('info');
  };

  const updatePoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(e.target.value);
  };

  const updateLino = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLino(e.target.value);
  };

  const saveConfig = () => {
    let changed = false;
    if (validatePoints()) {
      changed = true;
      user.points = Math.floor(Number(points));
    }
    if (validateLino()) {
      changed = true;
      user.setLino(lino).catch(null);
    }
    if (changed) {
      user.save().catch(null);
    }
    props.closePopup();
  };

  const isPage = (type: string): boolean => tab === type;

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
      <PopupDialogTabWrapper style={{ marginBottom: '10px' }}>
        <PopupDialogTabHeaderWrapper>
          <PopupDialogTab
            onClick={isPage('info') ? () => null : goToInfo}
            selected={isPage('info')}
          >
            {getPhrase('user_popup_tab_info')}
          </PopupDialogTab>
        </PopupDialogTabHeaderWrapper>
        <PopupDialogTabPage>
          {tab === 'info' ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('user_popup_permissions')}
                </PopupDialogInputName>
                <SelectWrap width={'100%'}>
                  <Select
                    value={user
                      .getPermissionStrings()
                      .map(item => ({ label: item, value: item }))}
                    isDisabled={true}
                    isMulti={true}
                  />
                </SelectWrap>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('user_popup_points')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={points}
                  min={0}
                  type='number'
                  onChange={updatePoints}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('user_popup_lino')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={lino}
                  min={0}
                  type='number'
                  onChange={updateLino}
                />
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : null}
        </PopupDialogTabPage>
      </PopupDialogTabWrapper>

      <PopupButtonWrapper>
        <Button
          disabled={!hasChanged()}
          onClick={hasChanged() ? saveConfig : () => null}
          style={{ zIndex: 4, position: 'static' }}
        >
          {getPhrase('users_settings_save')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
