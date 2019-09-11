import { firestore } from './firebase';
import { rxUser } from './rxUser';
import { filter, first } from 'rxjs/operators';
import { IUser } from '..';
import { db, User } from './db/db';

/**
 * @description Function that inits all async calls
 * 1. Grab latest users from firestore and add them to local db
 * 2. Start listening to changes to DB
 * 3. Start interval function every hour to backup to firestore
 */
export const start = async () => {
  rxUser
    .pipe(
      filter(x => !!x),
      first()
    )
    .subscribe(async authUser => {
      if (!authUser) {
        return setTimeout(() => {
          start().catch(null);
        }, 5000);
      }
      const fireUsers = await firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('users')
        .get()
        .then(collectionSnapshot => {
          const arr: User[] = [];
          /**
           * @description loop through all users from firestore/convert them to {User} format
           * append them to arr: User[]
           * set the users db to have all the users
           */
          collectionSnapshot.forEach(doc => {
            interface IOldUser extends IUser {
              dliveUsername?: string;
              linoUsername?: string;
            }
            const data = <IOldUser>doc.data();
            /**
             * @description convert the doc.data to a user object (note some information from 1.0 is using dliveUsername instead of displayname so we need to check for that and convert)
             */
            const user: IUser = {
              id: doc.id,
              displayname: data.displayname
                ? data.displayname
                : data.dliveUsername
                ? data.dliveUsername
                : '',
              username: data.username
                ? data.username
                : data.linoUsername
                ? data.linoUsername
                : '',
              avatar: data.avatar ? data.avatar : '',
              lino: data.lino ? data.lino : 0,
              points: data.points ? data.points : 0,
              exp: data.exp ? data.exp : 0,
              role: data.role
            };
            arr.push(
              new User(
                user.id,
                user.displayname,
                user.username,
                user.avatar,
                user.lino,
                user.points,
                user.exp,
                user.role
              )
            );
          });

          return arr;
        });
      /**
       * @description loop through all users and set to database
       */
      db.users.bulkAdd(fireUsers).catch(null);
    });
};
