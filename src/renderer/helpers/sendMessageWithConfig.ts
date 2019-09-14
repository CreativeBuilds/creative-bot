import { rxConfig } from './rxConfig';
import { filter, first, withLatestFrom } from 'rxjs/operators';
import { sendMessage } from './dlive/sendMessage';
import { rxMe } from './rxMe';

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
