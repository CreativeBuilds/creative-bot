import { rxChat } from './rxChat';
import { BehaviorSubject } from 'rxjs';
import { withLatestFrom, first } from 'rxjs/operators';
import { rxConfig } from './rxConfig';
import { rxUsers } from './rxUsers';
import { IConfig, IChatObject } from '..';
import { User } from './db/db';

/**
 * @description this is a behavior subject mapped by the ids of the users who have chatted recently. This will be wipped every setInterval (min 1 minute)
 */
export const recentChatters = new BehaviorSubject<{
  [id: string]: Partial<IChatObject>;
}>({});

/**
 * @description will get the latest users and then loop through all recentChatters and give them points
 */
const rewardRecentChatters = (config: Partial<IConfig>) => {
  rxUsers
    .pipe(
      first(),
      withLatestFrom(recentChatters)
    )
    .subscribe(([users, mRecentChatters]) => {
      Object.keys(mRecentChatters).forEach(username => {
        console.log('RECENT CHATTER', mRecentChatters);
        // tslint:disable-next-line: no-suspicious-comment
        /**
         * @TODO make the points that are added come from the config
         */
        const chat = mRecentChatters[username];
        const sender = chat.sender;
        if (!sender || !chat.role) {
          return;
        }
        let user = !users[username]
          ? new User(
              sender.username,
              sender.displayname,
              sender.username,
              sender.avatar,
              0,
              0,
              0,
              chat.role
            )
          : new User(
              users[username].username,
              sender.displayname,
              users[username].username,
              users[username].avatar,
              users[username].lino,
              users[username].points,
              users[username].exp,
              users[username].role
            );
        console.log('adding 1 point to', username);
        user.addPoints(1).catch(null);
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
      mEditedUsers[chat.sender.username] = chat;
      recentChatters.next(mEditedUsers);
    });
  let currentLoop;

  /**
   * @description subscribes to config and listens to changes for the loop time
   * @warning there is no variable for this YET
   */
  rxConfig.subscribe(config => {
    if (!config) {
      return;
    }
    currentLoop = setInterval(() => {
      rewardRecentChatters(config);
    }, 1000 * 10);
  });
};