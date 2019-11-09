import { rxConfig } from './rxConfig';
import { filter, first, withLatestFrom } from 'rxjs/operators';
import { sendMessage } from './dlive/sendMessage';
import { rxMe } from './rxMe';
import { User } from './db/db';

/**
 * @description will use rxConfig, wait till it has a streamerAuthKey and authKey then send the message
 */
export const sendMessageWithConfig = (message: string) => {
  rxConfig
    .pipe(
      filter(
        x =>
          !!x &&
          !!{ streamerAuthKey: null, ...x }.streamerAuthKey &&
          !!{ authKey: null, ...x }.authKey
      ),
      first()
    )
    .pipe(withLatestFrom(rxMe))
    .subscribe(([config, me]) => {
      if (!config) {
        return;
      }
      sendMessage(config.authKey, {
        message,
        roomRole: 'Moderator',
        streamer: me.username,
        subscribing: true
      }).catch(null);
    });
};

let timeouts: { [id: string]: number } = {};

export const sendEventMessageWithConfig = (
  message: string,
  type: string,
  user: User
) => {
  const timeout = { ...timeouts }[`${user.username}:${type}`];
  if (!!timeout) {
    try {
      clearTimeout(timeout);
    } catch (err) {
      (() => null)();
    }
  }
  timeouts[user.username] = setTimeout(() => {
    sendMessageWithConfig(message.replace('$USER', user.displayname));
    delete timeouts[`${user.username}:${type}`];
  }, 2000);
};
