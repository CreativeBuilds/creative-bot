import { rxChat } from './rxChat';
import { BehaviorSubject } from 'rxjs';
import { withLatestFrom, first } from 'rxjs/operators';
import { rxConfig } from './rxConfig';
import { IConfig, IChatObject } from '..';
import { User, rxUsers } from './db/db';
import { sendEvent } from './reactGA';

/**
 * @description this is a behavior subject mapped by the ids of the users who have chatted recently. This will be wipped every setInterval (min 1 minute)
 */
export const recentChatters = new BehaviorSubject<{
  [id: string]: Partial<IChatObject>;
}>({});

/**
 *
 * @description will get the latest users and then loop through all recentChatters and give them points
 */
const rewardRecentChatters = (config: Partial<IConfig>) => {
  rxUsers
    .pipe(
      first(),
      withLatestFrom(recentChatters.pipe(first()))
    )
    .subscribe(([users, mRecentChatters]) => {
      Object.keys(mRecentChatters).forEach(username => {
        // tslint:disable-next-line: no-suspicious-comment
        /**
         * @TODO make the points that are added come from the config
         */
        const chat = mRecentChatters[username];
        const sender = chat.sender;
        if (!sender || !chat.role || !chat.roomRole) {
          return;
        }
        const user = !users[username]
          ? new User(
              sender.username,
              sender.displayname,
              sender.username,
              sender.avatar,
              0,
              0,
              0,
              chat.role,
              chat.roomRole,
              !!chat.subscribing
            )
          : users[username];
        user.isSubscribed = !!chat.subscribing;
        user.roomRole = chat.roomRole;
        user
          .addPoints(config.points ? config.points : 5)
          .catch(err => console.error(err));
      });
      recentChatters.next({});
    });
};

/**
 * @description this file is to trigger functions on recent chat and is loaded by start.ts
 */
export const startRecentChat = () => {
  rxChat
    .pipe(withLatestFrom(recentChatters))
    .subscribe(([chat, mEditedUsers]) => {
      if (typeof chat === 'boolean') {
        return;
      }
      if (!chat || chat.type !== 'Message' || !chat.sender) {
        return;
      }
      // new chat message
      sendEvent('Chat', 'new').catch(null);
      mEditedUsers[chat.sender.username] = chat;
      recentChatters.next(mEditedUsers);
    });
  let currentLoop: number;

  /**
   * @description subscribes to config and listens to changes for the loop time
   * @warning there is no variable for this YET
   */
  rxConfig.subscribe(config => {
    if (!config) {
      return;
    }
    if (!!currentLoop) {
      try {
        clearInterval(currentLoop);
      } catch (err) {
        (() => null)();
      }
    }
    currentLoop = setInterval(() => {
      rewardRecentChatters(config);
    }, (config.pointsTimer ? config.pointsTimer : 300) * 1000);
  });
};
