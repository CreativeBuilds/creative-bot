import {
  filter,
  first,
  map,
  distinctUntilChanged,
  mergeMap,
  merge,
  combineLatest
} from 'rxjs/operators';
import { db, rxDbChanges, Command } from './db/db';
import { rxFireUsers, rxUsers } from './rxUsers';
import { startRecentChat } from './recentChat';
import { IDatabaseChange } from 'dexie-observable/api';
import { rxUser } from './rxUser';
import { firestore } from './firebase';
import { rxChat } from './rxChat';
import { rxTimers } from './rxTimers';
import { Subscription } from 'rxjs';
import { rxConfig } from './rxConfig';

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

export const startTimers = () => {
  const listeners: Subscription[] = [];
  const intervals: number[] = [];
  const listener = rxTimers.pipe(distinctUntilChanged()).subscribe(timers => {
    listeners.forEach(mListener => {
      mListener.unsubscribe();
    });
    intervals.forEach((timeout: number) => {
      clearInterval(timeout);
    });
    timers.forEach(timer => {
      let total = 0;
      if (!timer.enabled) {
        return null;
      }
      console.log('INSIDE FOR EACH ', timer.enabled, timer.seconds);

      const updateTotal = () => {
        total++;
      };

      const removeFromTotal = (int: number) => {
        total = total - int;
      };

      // For each timer listen to chat internally and determine if it should run

      intervals.push(
        setInterval(() => {
          if ((total > timer.messages || !timer.messages) && timer.enabled) {
            timer.run().catch(console.error);
            removeFromTotal(timer.messages);
            total = 0;
          }
        }, timer.seconds * 1000)
      );
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
      await db.users.bulkAdd(users).catch(err => {
        console.log('its fine');
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
  });
  startRecentChat();
  startTimers();
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
