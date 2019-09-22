import * as React from 'react';
import { User, Timer } from '@/renderer/helpers/db/db';
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
} from '../generic-styled-components/PopupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
import { rxTimers } from '@/renderer/helpers/rxTimers';

interface IProps {
  closePopup: Function;
  timer?: Timer;
}

/**
 * @descritpion Edit user popup or Add user popup
 */
export const AddOrEditTimerPopup = (props: IProps) => {
  const [timerName, setTimerName] = React.useState(
    props.timer ? props.timer.name : ''
  );
  const [timerReply, setTimerReply] = React.useState(
    props.timer ? props.timer.reply : ''
  );
  const [timerSeconds, setTimerSeconds] = React.useState(
    props.timer ? props.timer.seconds : 600
  );
  const [timerMessages, setTimerMessages] = React.useState(
    props.timer ? props.timer.messages : 0
  );

  const [timers, setTimers] = React.useState<{ [id: string]: Timer }>({});

  /**
   * @description load all current timers and then store them in a map to check to see if the edit/added one already exists to throw error
   */
  React.useEffect(() => {
    const listener = rxTimers.subscribe((mTimers: Timer[]) => {
      setTimers(
        mTimers.reduce((acc: { [id: string]: Timer }, timer: Timer) => {
          acc[timer.name.toLowerCase()] = timer;

          return acc;
        }, {})
      );
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  /**
   * @description handles the creation of a new timer, saves it, then closes the popup
   */
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newTimer = new Timer(
      timerName,
      timerReply,
      true,
      timerSeconds,
      timerMessages
    );
    newTimer.save();
    props.closePopup();
  };

  /**
   * @description handles the edit of a timer, saves, then closes the popup
   */
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const timer = props.timer;
    if (!timer) {
      return;
    }
    if (
      timerName === timer.name &&
      timerReply === timer.reply &&
      timerSeconds === timer.seconds &&
      timerMessages === timer.messages
    ) {
      return;
    }
    const newTimer = new Timer(
      timerName,
      timerReply,
      timer.enabled,
      timerSeconds,
      timerMessages
    );
    console.log('NEW TIMER', newTimer);
    newTimer.save();
    props.closePopup();
  };

  /**
   * @description checks if the user can hit the submit button or not
   * changes based if the user is in edit or add mode
   */
  const canSubmit = () => {
    if (props.timer) {
      const timer = props.timer;
      if (!timer) {
        return false;
      }
      if (
        timerName === timer.name &&
        timerReply === timer.reply &&
        timerSeconds === timer.seconds &&
        timerMessages === timer.messages
      ) {
        return false;
      }
    }

    return (
      timerReply.length > 0 &&
      timerName.length > 0 &&
      !isNaN(timerSeconds) &&
      !isNaN(timerMessages) &&
      timerSeconds >= 60
    );
  };

  const updateTimerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerName(e.target.value);
  };

  const updateTimerReply = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerReply(e.target.value);
  };

  const updateTimerMessages = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setTimerMessages(parseInt(e.target.value, undefined));
    } catch (err) {
      console.error('Got an error', err);
    }
  };

  const updateTimerSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerSeconds(parseInt(e.target.value, undefined));
  };

  return (
    <PopupDialog
      style={{
        height: 'min-content',
        width: '425px',
        minWidth: '425px',
        maxHeight: '95%'
      }}
    >
      <PopupDialogExitIcon>
        <FaTimes onClick={close}></FaTimes>
      </PopupDialogExitIcon>
      <PopupDialogTitle>
        {props.timer
          ? `${getPhrase('edit_timer_name')}, ${props.timer.name}`
          : getPhrase('new_timer_name')}
      </PopupDialogTitle>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_timer_name_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={timerName}
          onChange={updateTimerName}
          maxLength={16}
        />
        <PopupDialogInputInfo
          error={
            timerName.startsWith('!') ||
            (!!timers[timerName.toLowerCase()] &&
              (!!props.timer
                ? props.timer.name.toLowerCase() !== timerName.toLowerCase()
                : true))
          }
        >
          {!!timers[timerName.toLowerCase()] &&
          (!!props.timer
            ? props.timer.name.toLowerCase() !== timerName.toLowerCase()
            : true)
            ? getPhrase('new_timer_name_error_exists')
            : getPhrase('new_timer_name_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_timer_reply_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={timerReply}
          onChange={updateTimerReply}
          maxLength={140}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_timer_reply_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase(
            'new_timer_minseconds_title',
            !isNaN(timerSeconds) ? timerSeconds : 60
          )}
        </PopupDialogInputName>
        <PopupDialogInput
          value={isNaN(timerSeconds) ? '' : timerSeconds}
          onChange={updateTimerSeconds}
          type='number'
          min={60}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_timer_minseconds_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_timer_minmsgs_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={isNaN(timerMessages) ? '' : timerMessages}
          onChange={updateTimerMessages}
          type='number'
          min={0}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_timer_minmsgs_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupButtonWrapper style={{ position: 'relative', marginTop: '30px' }}>
        <Button
          disabled={!canSubmit()}
          onClick={
            canSubmit()
              ? !!props.timer
                ? handleEdit
                : handleCreate
              : () => console.log('HELLO WORLD WEEE')
          }
          style={{ zIndex: 4, position: 'static' }}
        >
          {props.timer
            ? getPhrase('edit_timer_submit')
            : getPhrase('new_timer_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
