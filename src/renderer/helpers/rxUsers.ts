import { firestore } from './firebase';
import { rxUser } from './rxUser';
import { switchMap, filter, map } from 'rxjs/operators';
import { ObservableInput, empty } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
import { IOldUser, IUser } from '..';
import { User } from './db/db';

/**
 * @description returns an array of User (class) objects
 */
export const rxUsers = rxUser.pipe(
  filter(x => !!x),
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
