import { filter, first, map } from 'rxjs/operators';
import { db, rxDbChanges, Command } from './db/db';
import { rxFireUsers, rxUsers } from './rxUsers';
import { startRecentChat } from './recentChat';
import { IDatabaseChange } from 'dexie-observable/api';
import { rxUser } from './rxUser';
import { firestore } from './firebase';

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
  rxFireUsers.subscribe(async users => {
    try {
      db.users.each(user => {
        console.log('USER EXISTS', user);
      });
      await db.users.bulkAdd(users).catch(err => {
        console.log('its fine');
      });
    } catch (err) {}

    if (listener) {
      // tslint:disable-next-line: no-unsafe-any
      listener.unsubscribe();
    }
    /**
     * @description this will save the user id to an object, that will be looped over every hour to update
     * the user to firestore
     */
    listener = rxDbChanges
      .pipe(
        map((changes: IDatabaseChange[]): IDatabaseChange[] => {
          return changes.reduce(
            (acc: IDatabaseChange[], curr): IDatabaseChange[] => {
              if (curr.table.toLowerCase() === 'users') {
                acc.push(curr);
              }

              return acc;
            },
            []
          );
        }, filter((changes: IDatabaseChange[]) => changes.length > 0))
      )
      .subscribe(changes => {
        changes.forEach(change => {
          changedUsers[change.key] = true;
          if (change.type === 3) {
            delete changedUsers[change.key];
          }
        });
      });
    const userListener = rxUsers
      .pipe(filter(x => !!x && Object.keys({ ...x }).length > 0))
      .subscribe(users => {
        if (!users.creativebuilds) {
          return console.log('no me');
        } else {
          const user = users.creativebuilds;
          console.log('DELETING ME', user);
          // user.delete();
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
