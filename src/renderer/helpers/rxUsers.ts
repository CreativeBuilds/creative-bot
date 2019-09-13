import { firestore } from './firebase';
import { rxUser } from './rxUser';
import { switchMap, filter, map, withLatestFrom, first } from 'rxjs/operators';
import { ObservableInput, BehaviorSubject } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
import { IOldUser, IUser } from '..';
import { User, rxDbChanges, db } from './db/db';
import { IDatabaseChange } from 'dexie-observable/api';

/**
 * @description returns an array of User (class) objects directly from firestore
 * @warning DO NOT SUBSCRIBE TO THIS IN COMPONENTS
 */
export const rxFireUsers = rxUser.pipe(
  filter(x => !!x),
  /**
   * @description this switchmap takes the current user id and returns a firestore reference using that uid
   * to get the firestore users.
   *
   * @note Everything down the line will update if a user in the firestore database updates
   */
  switchMap(
    (user): ObservableInput<any> => {
      if (!user) {
        return [];
      }

      const firestoreReference = firestore
        .collection('users')
        .doc(user.uid)
        .collection('users');

      return collectionData(firestoreReference);
    }
  ),
  map((users: IOldUser[]): User[] => {
    /**
     * @description maps over all the database users and converts them to the new class based users
     */
    return users.map(oldUser => {
      const user: IUser = {
        id: oldUser.username
          ? oldUser.username
          : oldUser.blockchainUsername
          ? oldUser.blockchainUsername
          : '',
        displayname: oldUser.displayname
          ? oldUser.displayname
          : oldUser.dliveUsername
          ? oldUser.dliveUsername
          : '',
        username: oldUser.username
          ? oldUser.username
          : oldUser.blockchainUsername
          ? oldUser.blockchainUsername
          : '',
        avatar: oldUser.avatar ? oldUser.avatar : '',
        lino: oldUser.lino ? oldUser.lino : 0,
        points: oldUser.points ? oldUser.points : 0,
        exp: oldUser.exp ? oldUser.exp : 0,
        role: oldUser.role
      };

      return new User(
        user.id,
        user.displayname,
        user.username,
        user.avatar,
        user.lino,
        user.points,
        user.exp,
        user.role
      );
    });
  })
);

/**
 * @description this is the userMap (local variable to store all users)
 */
const userMap = new BehaviorSubject<{ [id: string]: User } | null>(null);

/**
 * @description Get all the current users in the local database
 * and convert them to User class objects.
 */
db.users
  .toArray()
  .then(users => {
    /**
     * @description userMap.next sends the map of users from the local database to userMap
     * for a start value
     *
     * @note this only happens once and then will no longer update the BehaviorSubject when the
     * database updates
     */
    userMap.next(
      users.reduce((acc: { [id: string]: User }, curr) => {
        acc[curr.username] = curr;

        return acc;
      }, {})
    );
  })
  .catch(null);

/**
 * @description gets all the users in a map format.
 * If you want all the users this is what you should subscribe to, or you can use rxUsersArray
 */
export const rxUsers = rxDbChanges
  .pipe(
    switchMap(() => {
      return userMap;
    })
  )
  .pipe(
    filter(x => !!x),
    first(),
    switchMap(() => {
      return rxDbChanges;
    })
  )
  .pipe(
    map((changeArr: IDatabaseChange[]) => {
      return changeArr.reduce((acc: IDatabaseChange[], curr) => {
        if (curr.table === 'users') {
          acc.push(curr);
        }

        return acc;
      }, []);
    })
  )
  .pipe(
    withLatestFrom(userMap),
    map(([changeArr, UserMap]) => {
      if (!UserMap) {
        userMap.next({});

        return {};
      }
      changeArr.forEach(change => {
        // tslint:disable-next-line: prefer-object-spread no-unsafe-any
        const curUser: IUser = Object.assign({ obj: {} }, change).obj;
        UserMap[curUser.username] = new User(
          curUser.id,
          curUser.displayname,
          curUser.username,
          curUser.avatar,
          curUser.lino,
          curUser.points,
          curUser.exp,
          curUser.role
        );
      });
      userMap.next(UserMap);

      return UserMap;
    })
  );

/**
 * @description same thing as rxUsers but formats it into an array of User class objects
 */
export const rxUsersArray = rxUsers.pipe(
  map((mUserMap: { [username: string]: User }): User[] => {
    const userArray: User[] = [];
    Object.keys(mUserMap).forEach(username => {
      userArray.push(mUserMap[username]);
    });

    return userArray;
  })
);
