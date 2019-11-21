import {
  filter,
  first,
  map,
  distinctUntilChanged,
  mergeMap,
  merge,
  combineLatest,
  skip
} from 'rxjs/operators';
import { startRecentChat } from './recentChat';
import { rxUser } from './rxUser';
import { firestore } from './firebase';
import { rxChat } from './rxChat';
import { rxTimers } from './rxTimers';
import { Subscription } from 'rxjs';
import { rxConfig } from './rxConfig';
import {
  insertUserToDB,
  rxFireUsers,
  rxUsers,
  rxDbChanges,
  getUsersFromDB,
  User
} from './db/db';
import { sendEvent } from './reactGA';
import { sendMessageWithConfig } from './sendMessageWithConfig';

export const lastBackedUpUsersToCloud = 0;

/**
 * @description takes an array of user ids that will be updated to firestore
 */
export const backupUsersToCloud = async (usersArray: string[]) => {
  if (Date.now() - lastBackedUpUsersToCloud < 1000 * 60 * 5) {
    return Promise.reject('Trying to update too soon!');
  }
  /**
   * @description gets the latest users from rxUsers
   *
   * @note this only happens once because first() will close the listener after it gets the initial data
   */

  rxUsers.pipe(first()).subscribe(usersMap => {
    usersArray.forEach((username): void => {
      sendEvent('Users', 'saved').catch(null);
      const saveToFirestore = () => {
        rxUser.pipe(first()).subscribe(authUser => {
          if (!authUser) {
            return;
          }
          firestore
            .collection('users')
            .doc(authUser.uid)
            .collection('users')
            .doc(usersMap[username].username)
            .set(usersMap[username].toJSON(), { merge: true })
            .catch(null);
        });
      };
      saveToFirestore();
    });
  });
};
/**
 * @description Function that inits all async calls
 * 1. Grab latest users from firestore and add them to local db
 * 2. Start listening to changes to DB
 * 3. Start interval function every hour to backup to firestore
 */
export const start = async () => {
  let listener: any;
  const changedUsers: { [id: string]: boolean } = {};
  /**
   * @description subscribe to the firestore users and if they update, update all users in the database with the new data. Then subscribe to rxDbChanges (local db changes) and for any user that updates, save the user id for later
   */
  let msg =
    'CreativeBot initialized, if you have any issues please report them in the support discord https://discord.gg/2DGaWDW';

  rxConfig
    .pipe(
      filter(x => {
        return !!x.authKey && !!x.streamerAuthKey;
      }),
      first()
    )
    .toPromise()
    .then(config => {
      setTimeout(() => {
        if (process.env.NODE_ENV === 'production') {
          sendMessageWithConfig(msg);
        }
      }, 3000);
    })
    .catch(null);

  rxFireUsers.subscribe(async users => {
    sendEvent('Users', 'fetched').catch(null);
    try {
      await getUsersFromDB().then(async currUsers => {
        let usernames = currUsers.map(user => user.username);
        // tslint:disable-next-line: no-unsafe-any
        const promises = users
          .reduce((acc: User[], user) => {
            if (!!user.username) {
              if (!usernames.includes(user.username)) {
                acc.push(user);
              }
            }
            return acc;
          }, [])
          .map(user => {
            return insertUserToDB(user);
          });

        await Promise.all(promises);
      });
    } catch (err) {
      (() => null)();
    }

    if (listener) {
      // tslint:disable-next-line: no-unsafe-any
      listener.unsubscribe();
    }
    /**
     * @description this will save the user id to an object, that will be looped over every hour to update
     * the user to firestore
     */
    listener = rxDbChanges.pipe(skip(1)).subscribe(change => {
      if (!change) return;
      if (!change.data?.username) return;
      if (change.name === 'addUser') {
        changedUsers[change.data?.username] = true;
      } else if (change.name === 'removeUser') {
        delete changedUsers[change.data?.username];
      }
    });
  });
  startRecentChat();
  setInterval(() => {
    /**
     * @description every hour, fire the backupUsersToCloud function
     */
    backupUsersToCloud(
      Object.keys(changedUsers).reduce((acc: string[], curr: string) => {
        acc.push(curr);

        return acc;
      }, [])
    ).catch(null);
  }, 1000 * 60 * 60);
};
