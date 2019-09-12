import { firestore } from './firebase';
import { rxUser } from './rxUser';
import { filter, first } from 'rxjs/operators';
import { IUser } from '..';
import { db, User } from './db/db';
import { collectionData } from 'rxfire/firestore';
import { rxUsers } from './rxUsers';

/**
 * @description Function that inits all async calls
 * 1. Grab latest users from firestore and add them to local db
 * 2. Start listening to changes to DB
 * 3. Start interval function every hour to backup to firestore
 */
export const start = async () => {
  rxUsers.subscribe(users => {
    db.users.bulkAdd(users).catch(null);
  });
};
